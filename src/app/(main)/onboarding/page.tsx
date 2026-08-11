import { getClasses } from '@/lib/data';
import { SpartanOnboarding } from '@/components/onboarding/spartan/spartan-onboarding';

export default async function OnboardingPage() {
  const classes = await getClasses();
  return <SpartanOnboarding initialClasses={classes} />;
}
