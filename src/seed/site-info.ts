/** Business facts shown on the site (confirmed by Madhan, 10 Nov 2026). Used by `npm run seed` and `npm run settings`. */
export const siteInfo = {
  businessName: 'DeepCleanz',
  phone: '+91 93636 09470',
  whatsapp: '919363609470',
  email: 'info@deepcleanz.com',
  address: '41, South Lock St, Kotturpuram, Chennai – 600 085',
  hours: [{ days: 'Mon–Sun', open: '6:00 AM', close: '11:00 PM' }],
  googleRating: 4.6,
  googleReviewCount: 77,
  homesCleanedDisplay: '260+',
  mapsLink: 'https://maps.app.goo.gl/8eaRtPbwnZ74kt4L8',
  googleReviewLink: 'https://g.page/r/CXp6yoLd2ls0EBM/review',
  upiId: '6374171901@ptaxis',
  gstNote: 'Prices exclude GST.',
}

const allDays: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

/** Booking start times — same three slots every day (confirmed 10 Nov 2026). */
export const bookingInfo = {
  startTimes: [
    { key: 'am-0830', label: '8:30 AM', half: 'am' as const, allowWholeDay: true, days: allDays },
    { key: 'am-1030', label: '10:30 AM', half: 'am' as const, allowWholeDay: true, days: allDays },
    { key: 'pm-1300', label: '1:00 PM', half: 'pm' as const, allowWholeDay: false, days: allDays },
  ],
  rescheduleHours: 3,
}
