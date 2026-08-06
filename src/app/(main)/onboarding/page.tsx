import { getClasses } from '@/lib/data';
import { OnboardingForm } from './onboarding-form';

export default async function OnboardingPage() {
  const classes = await getClasses();
  return <OnboardingForm initialClasses={classes} />;
}
