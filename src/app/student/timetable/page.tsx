import { PortalLayout } from "@/components/PortalLayout";
import { FeatureTable } from "@/components/FeatureTable";

export default function StudentTimetable() {
  return <PortalLayout role="student" title="Class Timetable">
    <FeatureTable title="My Timetable" description="Your current lecture schedule." action="list_timetable"
      columns={[{key:"day",label:"Day"},{key:"time",label:"Time"},{key:"course",label:"Course"},{key:"venue",label:"Venue"}]} />
  </PortalLayout>;
}
