export default function compareYears(yearToCompare) {
  const endDate = new Date(yearToCompare).getFullYear();
  const todayYear = new Date().getFullYear();

  // Info : when there is no end date on campaign creation,
  // API automatically sets one to 25 years later
  // we have to make sure that if it's the case, we don't display anything
  if (endDate - 10 > todayYear) {
    return false;
  }
  return true;
}
