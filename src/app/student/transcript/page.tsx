import { PortalLayout } from "@/components/PortalLayout";
import { FeatureTable } from "@/components/FeatureTable";

export default function StudentTranscript() {
  return <PortalLayout role="student" title="Academic Transcript">
    <FeatureTable title="Transcript" description="Academic history and cumulative performance." action="list_transcript"
      columns={[{key:"session",label:"Session"},{key:"semester",label:"Semester"},{key:"courses",label:"Courses"},{key:"gpa",label:"GPA"},{key:"cgpa",label:"CGPA"}]} />
  </PortalLayout>;
}
