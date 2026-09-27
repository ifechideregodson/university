import { PortalLayout } from "@/components/PortalLayout";
import { FeatureTable } from "@/components/FeatureTable";

export default function LecturerNotifications() {
  return <PortalLayout role="lecturer" title="Notifications">
    <FeatureTable title="Lecturer Notifications" action="list_notifications"
      columns={[{key:"title",label:"Notification"},{key:"audience",label:"Audience"},{key:"status",label:"Status"},{key:"date",label:"Date"}]} />
  </PortalLayout>;
}
