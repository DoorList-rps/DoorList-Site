import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useInvestmentDetail = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['investment', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Investment slug is required');
      
      console.log('Fetching investment details for slug:', slug);
      
      // First, get the investment details
      const { data: investmentData, error: investmentError } = await supabase
        .from('investments')
        .select('*')
        .eq('slug', slug)
        .single();

      if (investmentError) throw investmentError;
      if (!investmentData) throw new Error('Investment not found');

      // Then, if we have a sponsor_name, get the sponsor details
      if (investmentData.sponsor_name) {
        const { data: sponsorData, error: sponsorError } = await supabase
          .from('sponsors')
          .select(`
            name,
            logo_url,
            year_founded,
            assets_under_management,
            deal_volume,
            number_of_deals,
            advertised_returns,
            holding_period,
            slug
          `)
          .eq('name', investmentData.sponsor_name)
          .single();

        if (!sponsorError && sponsorData) {
          investmentData.sponsors = sponsorData;
        } else {
          // If no sponsor found, create a basic sponsor object from the name
          investmentData.sponsors = {
            name: investmentData.sponsor_name,
            logo_url: null,
            year_founded: null,
            assets_under_management: null,
            deal_volume: null,
            number_of_deals: null,
            advertised_returns: null,
            holding_period: null,
            slug: null
          };
        }
      }
      
      return investmentData;
    },
    enabled: !!slug
  });
};