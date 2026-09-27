import { PortalLayout } from "@/components/PortalLayout";
import { FeatureTable } from "@/components/FeatureTable";

export default function StudentAttendance() {
  return <PortalLayout role="student" title="Attendance">
    <FeatureTable title="Attendance Record" description="Track your attendance by course." action="list_attendance"
      columns={[{key:"course",label:"Course"},{key:"held",label:"Classes Held"},{key:"attended",label:"Attended"},{key:"percentage",label:"Attendance"}]} />
  </PortalLayout>;
}
