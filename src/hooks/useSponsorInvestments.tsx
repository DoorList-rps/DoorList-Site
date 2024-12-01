import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSponsorInvestments = (sponsorName: string | undefined) => {
  return useQuery({
    queryKey: ['sponsor-investments', sponsorName],
    queryFn: async () => {
      if (!sponsorName) throw new Error('No sponsor name provided');
      
      console.log('Fetching investments for sponsor:', sponsorName);
      
      const { data, error } = await supabase
        .from('investments')
        .select(`
          *,
          sponsors (
            name,
            logo_url,
            year_founded,
            assets_under_management,
            deal_volume,
            number_of_deals,
            advertised_returns,
            holding_period,
            slug
          )
        `)
        .eq('sponsor_name', sponsorName)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching sponsor investments:', error);
        throw error;
      }

      console.log('Found investments:', data);
      
      return data;
    },
    enabled: !!sponsorName
  });
};