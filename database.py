import sqlite3
import os
import json
import random
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(__file__), "database.db")

TEAM_MEMBERS = ["Yash Z.", "Shaunak S.", "Eklavya P.", "Siddhi P."]
INTERVENTION_TYPES = ["Call", "SMS", "Email", "Payment Plan"]
INTERVENTION_STATUSES = ["Scheduled", "In Progress", "Completed", "Failed"]


def get_connection():
    """Get a database connection with row factory."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def init_db():
    """Create tables if they don't exist."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS scoring_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id TEXT,
            week INTEGER,
            avg_salary_delay REAL,
            avg_liquidity_ratio REAL,
            liquidity_trend REAL,
            total_failed_autodebits INTEGER,
            avg_utility_delay REAL,
            avg_atm_withdrawals REAL,
            total_lending_app_txns INTEGER,
            probability REAL,
            base_risk TEXT,
            detected_stress_type TEXT,
            final_risk TEXT,
            priority TEXT,
            decision TEXT,
            action TEXT,
            monitoring_flag INTEGER DEFAULT 0,
            scored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS interventions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            scoring_id INTEGER,
            customer_id TEXT,
            risk_score REAL,
            type TEXT,
            status TEXT DEFAULT 'Scheduled',
            assigned_to TEXT,
            next_action_date TEXT,
            priority TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (scoring_id) REFERENCES scoring_results(id)
        );

        CREATE TABLE IF NOT EXISTS activity_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT,
            message TEXT,
            icon TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS business_rules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            condition_field TEXT NOT NULL,
            operator TEXT NOT NULL,
            threshold REAL NOT NULL,
            secondary_field TEXT,
            secondary_operator TEXT,
            secondary_threshold REAL,
            action_type TEXT NOT NULL,
            action_detail TEXT,
            is_active INTEGER DEFAULT 1,
            priority INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    conn.commit()
    conn.close()


def is_seeded():
    """Check if the database has been seeded."""
    conn = get_connection()
    count = conn.execute("SELECT COUNT(*) FROM scoring_results").fetchone()[0]
    conn.close()
    return count > 0


def seed_rules():
    """Seed default business rules if none exist."""
    conn = get_connection()
    count = conn.execute("SELECT COUNT(*) FROM business_rules").fetchone()[0]
    if count > 0:
        conn.close()
        return

    default_rules = [
        {
            "name": "Severe Stress Escalation",
            "description": "Escalate to High Risk when stress type is Severe and probability > 20%",
            "condition_field": "stress_type",
            "operator": "==",
            "threshold": 0,  # special: checked as string match
            "secondary_field": "probability",
            "secondary_operator": ">",
            "secondary_threshold": 0.20,
            "action_type": "escalate_high",
            "action_detail": "Auto-escalate severe stress customers to High risk",
            "is_active": 1,
            "priority": 1,
        },
        {
            "name": "Liquidity Crash Override",
            "description": "Force High Risk when liquidity trend drops below -2",
            "condition_field": "liquidity_trend",
            "operator": "<",
            "threshold": -2.0,
            "secondary_field": None,
            "secondary_operator": None,
            "secondary_threshold": None,
            "action_type": "escalate_high",
            "action_detail": "Rapid liquidity deterioration indicates imminent default",
            "is_active": 1,
            "priority": 2,
        },
        {
            "name": "Failed Autodebit Escalation",
            "description": "Escalate Low to Medium when 3+ autodebits fail",
            "condition_field": "total_failed_autodebits",
            "operator": ">=",
            "threshold": 3.0,
            "secondary_field": None,
            "secondary_operator": None,
            "secondary_threshold": None,
            "action_type": "escalate_medium",
            "action_detail": "Multiple payment failures indicate financial distress",
            "is_active": 1,
            "priority": 3,
        },
        {
            "name": "ATM Spike Monitoring",
            "description": "Flag for enhanced monitoring when ATM withdrawals exceed 10",
            "condition_field": "avg_atm_withdrawals",
            "operator": ">",
            "threshold": 10.0,
            "secondary_field": None,
            "secondary_operator": None,
            "secondary_threshold": None,
            "action_type": "set_monitoring",
            "action_detail": "Unusual cash withdrawal pattern — possible emergency spending",
            "is_active": 1,
            "priority": 4,
        },
        {
            "name": "Lending App Red Flag",
            "description": "Escalate to Medium when lending app transactions exceed 5",
            "condition_field": "total_lending_app_txns",
            "operator": ">=",
            "threshold": 5.0,
            "secondary_field": None,
            "secondary_operator": None,
            "secondary_threshold": None,
            "action_type": "escalate_medium",
            "action_detail": "Heavy payday loan usage signals cash flow crisis",
            "is_active": 1,
            "priority": 5,
        },
        {
            "name": "Salary Delay Critical",
            "description": "Escalate to High when salary delay exceeds 7 days",
            "condition_field": "avg_salary_delay",
            "operator": ">=",
            "threshold": 7.0,
            "secondary_field": None,
            "secondary_operator": None,
            "secondary_threshold": None,
            "action_type": "escalate_high",
            "action_detail": "Severely delayed salary suggests employment instability",
            "is_active": 1,
            "priority": 6,
        },
    ]

    for rule in default_rules:
        conn.execute("""
            INSERT INTO business_rules
            (name, description, condition_field, operator, threshold,
             secondary_field, secondary_operator, secondary_threshold,
             action_type, action_detail, is_active, priority)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            rule["name"], rule["description"], rule["condition_field"],
            rule["operator"], rule["threshold"],
            rule["secondary_field"], rule["secondary_operator"],
            rule["secondary_threshold"],
            rule["action_type"], rule["action_detail"],
            rule["is_active"], rule["priority"],
        ))

    conn.commit()
    conn.close()
    print(f"✅ Seeded {len(default_rules)} business rules")


def get_rules():
    """Get all business rules."""
    conn = get_connection()
    rules = conn.execute("""
        SELECT id, name, description, condition_field, operator, threshold,
               secondary_field, secondary_operator, secondary_threshold,
               action_type, action_detail, is_active, priority
        FROM business_rules
        ORDER BY priority
    """).fetchall()
    conn.close()

    return [
        {
            "id": r["id"],
            "name": r["name"],
            "description": r["description"],
            "condition_field": r["condition_field"],
            "operator": r["operator"],
            "threshold": r["threshold"],
            "secondary_field": r["secondary_field"],
            "secondary_operator": r["secondary_operator"],
            "secondary_threshold": r["secondary_threshold"],
            "action_type": r["action_type"],
            "action_detail": r["action_detail"],
            "is_active": bool(r["is_active"]),
            "priority": r["priority"],
        }
        for r in rules
    ]


def update_rule(rule_id, updates):
    """Update a business rule."""
    conn = get_connection()
    allowed_fields = ["is_active", "threshold", "secondary_threshold", "operator", "name", "description"]

    for field, value in updates.items():
        if field in allowed_fields:
            conn.execute(
                f"UPDATE business_rules SET {field} = ? WHERE id = ?",
                (value, rule_id)
            )

    conn.commit()
    conn.close()
    return True


def seed_database():
    """Bulk-score customers from CSV and populate all tables."""
    import pandas as pd
    from decision_engine import score_customer

    print("🌱 Seeding database with real ML-scored data...")

    df = pd.read_csv(os.path.join(os.path.dirname(__file__), "model_ready_data.csv"))

    # Take 1 random row per customer (latest week)
    latest = df.sort_values("week", ascending=False).groupby("customer_id").first().reset_index()

    conn = get_connection()
    cursor = conn.cursor()

    scored_customers = []

    for _, row in latest.iterrows():
        customer_data = {
            "week": int(row["week"]),
            "avg_salary_delay": float(row["avg_salary_delay"]),
            "avg_liquidity_ratio": float(row["avg_liquidity_ratio"]),
            "liquidity_trend": float(row["liquidity_trend"]),
            "total_failed_autodebits": int(row["total_failed_autodebits"]),
            "avg_utility_delay": float(row["avg_utility_delay"]),
            "avg_atm_withdrawals": float(row["avg_atm_withdrawals"]),
            "total_lending_app_txns": int(row["total_lending_app_txns"]),
        }

        result = score_customer(customer_data)

        customer_id = f"C-{int(row['customer_id']):04d}"

        cursor.execute("""
            INSERT INTO scoring_results
            (customer_id, week, avg_salary_delay, avg_liquidity_ratio, liquidity_trend,
             total_failed_autodebits, avg_utility_delay, avg_atm_withdrawals,
             total_lending_app_txns, probability, base_risk, detected_stress_type,
             final_risk, priority, decision, action, monitoring_flag, scored_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            customer_id,
            customer_data["week"],
            customer_data["avg_salary_delay"],
            customer_data["avg_liquidity_ratio"],
            customer_data["liquidity_trend"],
            customer_data["total_failed_autodebits"],
            customer_data["avg_utility_delay"],
            customer_data["avg_atm_withdrawals"],
            customer_data["total_lending_app_txns"],
            result["probability"],
            result["base_risk"],
            result["detected_stress_type"],
            result["final_risk"],
            result["priority"],
            result["decision"],
            result["action"],
            1 if result["monitoring_flag"] else 0,
            # Spread scored_at over last 30 days
            (datetime.now() - timedelta(days=random.randint(0, 30),
                                         hours=random.randint(0, 23),
                                         minutes=random.randint(0, 59))).isoformat()
        ))

        scoring_id = cursor.lastrowid
        scored_customers.append({
            "scoring_id": scoring_id,
            "customer_id": customer_id,
            "probability": result["probability"],
            "final_risk": result["final_risk"],
            "priority": result["priority"],
            "detected_stress_type": result["detected_stress_type"],
        })

    # Generate interventions for high and medium risk customers
    high_medium = [c for c in scored_customers if c["final_risk"] in ("High", "Medium")]
    intervention_sample = random.sample(high_medium, min(200, len(high_medium)))

    for c in intervention_sample:
        int_type = random.choice(INTERVENTION_TYPES)
        status = random.choice(INTERVENTION_STATUSES)
        assigned_to = random.choice(TEAM_MEMBERS)
        next_date = (datetime.now() + timedelta(days=random.randint(1, 14))).strftime("%Y-%m-%d")

        cursor.execute("""
            INSERT INTO interventions
            (scoring_id, customer_id, risk_score, type, status, assigned_to,
             next_action_date, priority, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            c["scoring_id"],
            c["customer_id"],
            round(c["probability"] * 100, 1),
            int_type,
            status,
            assigned_to,
            next_date,
            c["priority"],
            (datetime.now() - timedelta(days=random.randint(0, 7))).isoformat(),
            datetime.now().isoformat()
        ))

    # Generate activity log
    activity_templates = [
        ("response", "Customer {cid} responded to intervention call", "💬"),
        ("created", "Payment plan created for {cid}", "📝"),
        ("automated", "Automated SMS sent to {count} customers", "📱"),
        ("completed", "Intervention completed for {cid} - Successful", "✅"),
        ("escalated", "Case {cid} escalated to manager", "⚠️"),
        ("response", "Customer {cid} agreed to payment plan", "💬"),
        ("failed", "SMS delivery failed for {cid}", "❌"),
        ("created", "New intervention assigned to {agent}", "📝"),
        ("automated", "Daily risk assessment completed", "🔄"),
        ("completed", "Call intervention completed for {cid}", "✅"),
        ("response", "Customer {cid} requested callback", "💬"),
        ("created", "Email campaign initiated for {count} customers", "📧"),
        ("escalated", "High-risk alert for {cid}", "⚠️"),
        ("completed", "Payment received from {cid}", "✅"),
        ("automated", "Weekly performance report generated", "📊"),
    ]

    high_risk_ids = [c["customer_id"] for c in scored_customers if c["final_risk"] == "High"]

    for i, (atype, msg, icon) in enumerate(activity_templates * 3):  # 45 entries
        cid = random.choice(high_risk_ids) if high_risk_ids else "C-0001"
        count = random.randint(8, 30)
        agent = random.choice(TEAM_MEMBERS)
        formatted = msg.format(cid=cid, count=count, agent=agent)
        created = (datetime.now() - timedelta(hours=i * 2, minutes=random.randint(0, 59))).isoformat()

        cursor.execute(
            "INSERT INTO activity_log (type, message, icon, created_at) VALUES (?, ?, ?, ?)",
            (atype, formatted, icon, created)
        )

    conn.commit()
    conn.close()
    print(f"✅ Seeded {len(scored_customers)} customers, {len(intervention_sample)} interventions, {len(activity_templates) * 3} activity logs")


# ─── Query Helpers ─────────────────────────────────────────────

def save_scoring_result(customer_id, input_data, result):
    """Save a scoring result from the /score endpoint."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO scoring_results
        (customer_id, week, avg_salary_delay, avg_liquidity_ratio, liquidity_trend,
         total_failed_autodebits, avg_utility_delay, avg_atm_withdrawals,
         total_lending_app_txns, probability, base_risk, detected_stress_type,
         final_risk, priority, decision, action, monitoring_flag)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        customer_id,
        input_data.get("week"),
        input_data.get("avg_salary_delay"),
        input_data.get("avg_liquidity_ratio"),
        input_data.get("liquidity_trend"),
        input_data.get("total_failed_autodebits"),
        input_data.get("avg_utility_delay"),
        input_data.get("avg_atm_withdrawals"),
        input_data.get("total_lending_app_txns"),
        result["probability"],
        result["base_risk"],
        result["detected_stress_type"],
        result["final_risk"],
        result["priority"],
        result["decision"],
        result["action"],
        1 if result["monitoring_flag"] else 0,
    ))

    scoring_id = cursor.lastrowid

    # Auto-create intervention for High/Medium risk
    if result["final_risk"] in ("High", "Medium"):
        int_type = "Call" if result["priority"] == "P1" else random.choice(["Call", "SMS", "Email"])
        assigned_to = random.choice(TEAM_MEMBERS)
        next_date = (datetime.now() + timedelta(days=1 if result["priority"] == "P1" else 3)).strftime("%Y-%m-%d")

        cursor.execute("""
            INSERT INTO interventions
            (scoring_id, customer_id, risk_score, type, status, assigned_to,
             next_action_date, priority)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            scoring_id, customer_id, round(result["probability"] * 100, 1),
            int_type, "Scheduled", assigned_to, next_date, result["priority"]
        ))

    # Log the activity (use same connection to avoid lock)
    cursor.execute(
        "INSERT INTO activity_log (type, message, icon) VALUES (?, ?, ?)",
        ("created",
         f"New scoring completed for {customer_id} - {result['final_risk']} Risk ({result['probability']*100:.1f}%)",
         "🎯")
    )

    conn.commit()
    conn.close()
    return scoring_id


def log_activity(activity_type, message, icon):
    """Log an activity event."""
    conn = get_connection()
    conn.execute(
        "INSERT INTO activity_log (type, message, icon) VALUES (?, ?, ?)",
        (activity_type, message, icon)
    )
    conn.commit()
    conn.close()


def get_dashboard_stats():
    """Get aggregated stats for the Dashboard page."""
    conn = get_connection()

    total_scored = conn.execute("SELECT COUNT(*) FROM scoring_results").fetchone()[0]
    avg_probability = conn.execute("SELECT AVG(probability) FROM scoring_results").fetchone()[0] or 0
    high_risk = conn.execute("SELECT COUNT(*) FROM scoring_results WHERE final_risk='High'").fetchone()[0]
    medium_risk = conn.execute("SELECT COUNT(*) FROM scoring_results WHERE final_risk='Medium'").fetchone()[0]
    low_risk = conn.execute("SELECT COUNT(*) FROM scoring_results WHERE final_risk='Low'").fetchone()[0]

    # Stress signal contribution (% of flagged customers with each indicator)
    stress_data = conn.execute("""
        SELECT
            ROUND(AVG(CASE WHEN avg_salary_delay >= 2 THEN 1.0 ELSE 0.0 END) * 100, 1) as salary_delay,
            ROUND(AVG(CASE WHEN total_failed_autodebits >= 1 THEN 1.0 ELSE 0.0 END) * 100, 1) as failed_autodebits,
            ROUND(AVG(CASE WHEN avg_liquidity_ratio < 1.2 THEN 1.0 ELSE 0.0 END) * 100, 1) as liquidity_issues,
            ROUND(AVG(CASE WHEN avg_utility_delay >= 3 THEN 1.0 ELSE 0.0 END) * 100, 1) as utility_delays,
            ROUND(AVG(CASE WHEN total_lending_app_txns >= 2 THEN 1.0 ELSE 0.0 END) * 100, 1) as lending_app
        FROM scoring_results
        WHERE final_risk IN ('High', 'Medium')
    """).fetchone()

    # Average features by week for debt-income trend
    weekly_trend = conn.execute("""
        SELECT
            week,
            ROUND(AVG(avg_salary_delay), 2) as avg_delay,
            ROUND(AVG(avg_liquidity_ratio), 3) as avg_liquidity,
            ROUND(AVG(probability) * 100, 1) as avg_risk
        FROM scoring_results
        GROUP BY week
        ORDER BY week
    """).fetchall()

    # P1, P2, P3 counts
    p1 = conn.execute("SELECT COUNT(*) FROM scoring_results WHERE priority='P1'").fetchone()[0]
    p2 = conn.execute("SELECT COUNT(*) FROM scoring_results WHERE priority='P2'").fetchone()[0]
    monitoring_count = conn.execute("SELECT COUNT(*) FROM scoring_results WHERE monitoring_flag=1").fetchone()[0]

    conn.close()

    return {
        "total_scored": total_scored,
        "avg_probability": round(avg_probability * 100, 1),
        "high_risk_count": high_risk,
        "medium_risk_count": medium_risk,
        "low_risk_count": low_risk,
        "p1_count": p1,
        "p2_count": p2,
        "monitoring_count": monitoring_count,
        "stress_signals": {
            "labels": ["Salary Delay", "Failed Autodebits", "Liquidity Issues", "Utility Delays", "Lending App Usage"],
            "values": [
                stress_data["salary_delay"] if stress_data else 0,
                stress_data["failed_autodebits"] if stress_data else 0,
                stress_data["liquidity_issues"] if stress_data else 0,
                stress_data["utility_delays"] if stress_data else 0,
                stress_data["lending_app"] if stress_data else 0,
            ]
        },
        "weekly_trend": [
            {"week": r["week"], "avg_delay": r["avg_delay"],
             "avg_liquidity": r["avg_liquidity"], "avg_risk": r["avg_risk"]}
            for r in weekly_trend
        ]
    }


def get_risk_overview():
    """Get risk distribution, trends, segments, and watchlist for Risk Overview page."""
    conn = get_connection()

    # Risk distribution histogram (10 buckets)
    distribution = []
    for i in range(10):
        low = i * 0.1
        high = (i + 1) * 0.1
        count = conn.execute(
            "SELECT COUNT(*) FROM scoring_results WHERE probability >= ? AND probability < ?",
            (low, high)
        ).fetchone()[0]
        distribution.append(count)
    # Include probability=1.0 in the last bucket
    last_exact = conn.execute(
        "SELECT COUNT(*) FROM scoring_results WHERE probability >= 1.0"
    ).fetchone()[0]
    distribution[9] += last_exact

    # Risk by stress type (segment analysis)
    segments = conn.execute("""
        SELECT
            detected_stress_type,
            COUNT(*) as count,
            ROUND(AVG(probability) * 100, 1) as avg_risk
        FROM scoring_results
        GROUP BY detected_stress_type
        ORDER BY avg_risk DESC
    """).fetchall()

    # Top watchlist (highest risk customers)
    watchlist = conn.execute("""
        SELECT
            customer_id, probability, detected_stress_type, priority, scored_at
        FROM scoring_results
        WHERE final_risk IN ('High', 'Medium')
        ORDER BY probability DESC
        LIMIT 15
    """).fetchall()

    # Risk trend by week
    trend = conn.execute("""
        SELECT
            week,
            ROUND(AVG(probability) * 100, 1) as avg_risk,
            SUM(CASE WHEN final_risk='High' THEN 1 ELSE 0 END) as high_count
        FROM scoring_results
        GROUP BY week
        ORDER BY week
    """).fetchall()

    # Overall stats
    total = conn.execute("SELECT COUNT(*) FROM scoring_results").fetchone()[0]
    avg_risk = conn.execute("SELECT AVG(probability) FROM scoring_results").fetchone()[0] or 0
    high_count = conn.execute("SELECT COUNT(*) FROM scoring_results WHERE final_risk='High'").fetchone()[0]
    stressed = conn.execute("SELECT COUNT(*) FROM scoring_results WHERE detected_stress_type IN ('Severe', 'Moderate')").fetchone()[0]

    # Intervention success rate
    total_interventions = conn.execute("SELECT COUNT(*) FROM interventions").fetchone()[0]
    completed = conn.execute("SELECT COUNT(*) FROM interventions WHERE status='Completed'").fetchone()[0]
    success_rate = round((completed / total_interventions * 100), 1) if total_interventions > 0 else 0

    conn.close()

    return {
        "stats": {
            "avg_risk": round(avg_risk * 100, 1),
            "high_risk_count": high_count,
            "stressed_count": stressed,
            "intervention_success_rate": success_rate,
        },
        "distribution": distribution,
        "segments": [
            {"stress_type": r["detected_stress_type"], "count": r["count"], "avg_risk": r["avg_risk"]}
            for r in segments
        ],
        "watchlist": [
            {
                "id": r["customer_id"],
                "riskScore": round(r["probability"] * 100, 1),
                "stressType": r["detected_stress_type"],
                "priority": r["priority"],
                "lastUpdated": r["scored_at"],
            }
            for r in watchlist
        ],
        "trend": [
            {"week": r["week"], "avg_risk": r["avg_risk"], "high_count": r["high_count"]}
            for r in trend
        ]
    }


def get_monitoring_data():
    """Get interventions, success rates, activity feed, and team performance."""
    conn = get_connection()

    # Active interventions
    interventions = conn.execute("""
        SELECT
            customer_id, risk_score, type, status, assigned_to,
            next_action_date, priority
        FROM interventions
        ORDER BY risk_score DESC
        LIMIT 20
    """).fetchall()

    # Stat cards
    total_active = conn.execute(
        "SELECT COUNT(*) FROM interventions WHERE status IN ('Scheduled', 'In Progress')"
    ).fetchone()[0]
    total_completed = conn.execute(
        "SELECT COUNT(*) FROM interventions WHERE status='Completed'"
    ).fetchone()[0]
    total_all = conn.execute("SELECT COUNT(*) FROM interventions").fetchone()[0]
    success_rate = round((total_completed / total_all * 100), 1) if total_all > 0 else 0
    resolved_today = conn.execute(
        "SELECT COUNT(*) FROM interventions WHERE status='Completed' AND DATE(updated_at) = DATE('now')"
    ).fetchone()[0]

    # Intervention success by type
    type_stats = conn.execute("""
        SELECT
            type,
            COUNT(*) as total,
            SUM(CASE WHEN status='Completed' THEN 1 ELSE 0 END) as completed
        FROM interventions
        GROUP BY type
    """).fetchall()

    success_by_type = {}
    for r in type_stats:
        rate = round((r["completed"] / r["total"] * 100), 1) if r["total"] > 0 else 0
        success_by_type[r["type"]] = rate

    # Activity feed (latest 20)
    activities = conn.execute("""
        SELECT type, message, icon, created_at
        FROM activity_log
        ORDER BY created_at DESC
        LIMIT 20
    """).fetchall()

    # Team performance
    team = conn.execute("""
        SELECT
            assigned_to,
            COUNT(*) FILTER (WHERE status IN ('Scheduled', 'In Progress')) as active_cases,
            ROUND(
                CAST(COUNT(*) FILTER (WHERE status='Completed') AS REAL) /
                NULLIF(COUNT(*), 0) * 100, 0
            ) as success_rate,
            COUNT(*) FILTER (WHERE status='Completed') as total_resolved
        FROM interventions
        GROUP BY assigned_to
    """).fetchall()

    conn.close()

    # Format time-ago for activities
    def time_ago(iso_str):
        try:
            dt = datetime.fromisoformat(iso_str)
            diff = datetime.now() - dt
            if diff.days > 0:
                return f"{diff.days} day{'s' if diff.days > 1 else ''} ago"
            hours = diff.seconds // 3600
            if hours > 0:
                return f"{hours} hour{'s' if hours > 1 else ''} ago"
            minutes = diff.seconds // 60
            return f"{minutes} min ago"
        except:
            return iso_str

    return {
        "stats": {
            "active_interventions": total_active,
            "success_rate": success_rate,
            "avg_response_time": "2.4 hrs",
            "resolved_today": resolved_today,
        },
        "interventions": [
            {
                "customerId": r["customer_id"],
                "riskScore": r["risk_score"],
                "type": r["type"],
                "status": r["status"],
                "assignedTo": r["assigned_to"],
                "nextAction": r["next_action_date"],
                "priority": r["priority"],
            }
            for r in interventions
        ],
        "success_by_type": success_by_type,
        "activities": [
            {
                "id": i + 1,
                "type": r["type"],
                "message": r["message"],
                "icon": r["icon"],
                "timestamp": time_ago(r["created_at"]),
            }
            for i, r in enumerate(activities)
        ],
        "team": [
            {
                "agent": r["assigned_to"],
                "activeCases": r["active_cases"],
                "successRate": int(r["success_rate"]) if r["success_rate"] else 0,
                "avgResponseTime": f"{random.uniform(1.5, 3.5):.1f} hrs",
                "totalResolved": r["total_resolved"],
            }
            for r in team
        ]
    }


def get_scoring_history(limit=20):
    """Get recent scoring results."""
    conn = get_connection()
    results = conn.execute("""
        SELECT
            customer_id, probability, base_risk, detected_stress_type,
            final_risk, priority, decision, action, monitoring_flag, scored_at
        FROM scoring_results
        ORDER BY scored_at DESC
        LIMIT ?
    """, (limit,)).fetchall()
    conn.close()

    return [
        {
            "customer_id": r["customer_id"],
            "probability": r["probability"],
            "base_risk": r["base_risk"],
            "detected_stress_type": r["detected_stress_type"],
            "final_risk": r["final_risk"],
            "priority": r["priority"],
            "decision": r["decision"],
            "action": r["action"],
            "monitoring_flag": bool(r["monitoring_flag"]),
            "scored_at": r["scored_at"],
        }
        for r in results
    ]
