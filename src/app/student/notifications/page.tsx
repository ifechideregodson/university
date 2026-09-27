import { PortalLayout } from "@/components/PortalLayout";
import { FeatureTable } from "@/components/FeatureTable";

export default function StudentNotifications() {
  return <PortalLayout role="student" title="Notifications">
    <FeatureTable title="My Notifications" description="Important academic and account updates." action="list_notifications"
      columns={[{key:"title",label:"Notification"},{key:"audience",label:"Audience"},{key:"status",label:"Status"},{key:"date",label:"Date"}]} />
  </PortalLayout>;
}
