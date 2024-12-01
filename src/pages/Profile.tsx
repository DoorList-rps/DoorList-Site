import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  const { data: savedInvestments, isLoading: investmentsLoading } = useQuery({
    queryKey: ['saved-investments'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('saved_investments')
        .select(`
          investment_id,
          investments (
            id,
            name,
            short_description,
            thumbnail_url,
            hero_image_url,
            minimum_investment,
            target_return,
            location_city,
            location_state,
            slug
          )
        `)
        .eq('user_id', session.user.id);

      if (error) throw error;
      return data;
    }
  });

  const isLoading = profileLoading || investmentsLoading;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        {/* User Profile Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-doorlist-navy mb-6">Profile Information</h2>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ) : userProfile ? (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium">
                      {userProfile.first_name || userProfile.last_name 
                        ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`
                        : 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{userProfile.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone Number</p>
                    <p className="font-medium">{userProfile.phone_number || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Accredited Investor Status</p>
                    <p className="font-medium">
                      {userProfile.is_accredited_investor === true ? 'Yes' 
                        : userProfile.is_accredited_investor === false ? 'No' 
                        : 'Not specified'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <p className="text-gray-600">Failed to load profile information</p>
          )}
        </div>

        {/* Saved Investments Section */}
        <h2 className="text-2xl font-bold text-doorlist-navy mb-6">Saved Investments</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse">
                <div className="bg-gray-200 aspect-video rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : !savedInvestments || savedInvestments.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600">No saved investments yet</h3>
            <p className="text-gray-500 mt-2">
              Browse our <Link to="/investments" className="text-doorlist-salmon hover:underline">investment opportunities</Link> to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedInvestments.map((saved) => (
              <Link 
                key={saved.investment_id} 
                to={`/investments/${saved.investments?.slug}`}
                className="block"
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <img
                      src={saved.investments?.thumbnail_url || saved.investments?.hero_image_url || '/placeholder.svg'}
                      alt={saved.investments?.name}
                      className="w-full h-full object-cover rounded-t-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{saved.investments?.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {saved.investments?.short_description}
                    </p>
                    {saved.investments?.minimum_investment && (
                      <p className="mt-2 text-sm text-gray-500">
                        Min. Investment: ${saved.investments.minimum_investment.toLocaleString()}
                      </p>
                    )}
                    {(saved.investments?.location_city || saved.investments?.location_state) && (
                      <p className="mt-1 text-sm text-gray-500">
                        {[saved.investments.location_city, saved.investments.location_state]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Profile;