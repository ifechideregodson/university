# Retool Workflow

Use one Retool Workflow webhook as the server-side data layer.

### Render environment
RETOOL_API_URL=your Retool Workflow webhook URL
RETOOL_API_KEY=server-side secret
AUTH_SECRET=long random secret
NEXT_PUBLIC_APP_NAME=Online University

Never expose RETOOL_API_KEY or AUTH_SECRET through NEXT_PUBLIC_* variables.

### Supported actions
initialize_database, submit_admission, list_admissions, approve_admission, reject_admission, register_user, login_user, change_password, list_students, update_student_status, create_course, update_course, create_material, create_assignment, create_exam, create_question, grade_assignment, publish_result, list_lecturer_courses, list_course_students, list_exam_attempts, student_dashboard, list_student_courses, list_student_results, list_student_payments, lecturer_dashboard, admin_dashboard, initialize_payment, list_payments.

### Admission lifecycle
Applicant submits -> Retool stores application -> admin approves -> workflow generates unique matric number -> student record/account is created or activated -> audit log is written.

### Security
Validate actor role in Retool for every staff/admin action. Enforce duplicate matric protection, duplicate course-registration protection, unit limits, prerequisites and active session/semester rules.
