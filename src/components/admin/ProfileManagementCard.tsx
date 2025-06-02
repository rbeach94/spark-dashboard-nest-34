
import { Edit, Eye, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  company: string | null;
  user_id: string;
}

export const ProfileManagementCard = () => {
  const { data: profiles, isLoading } = useQuery({
    queryKey: ["admin_profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nfc_profiles')
        .select('id, full_name, email, company, user_id')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Profile[];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Profile Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Profile Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {profiles?.map((profile) => (
            <div
              key={profile.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium">
                  {profile.full_name || 'Unnamed Profile'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {profile.email || 'No email'}
                </p>
                {profile.company && (
                  <p className="text-sm text-muted-foreground">
                    {profile.company}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Link to={`/profile/${profile.id}/view`}>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </Link>
                <Link to={`/profile/${profile.id}?admin=true`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          ))}
          {(!profiles || profiles.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              No profiles found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
