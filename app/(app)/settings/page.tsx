import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Settings</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">User profile and preference settings will go here.</p>
                </CardContent>
            </Card>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Export/Import functionality coming soon.</p>
                </CardContent>
            </Card>
        </div>
    );
}
