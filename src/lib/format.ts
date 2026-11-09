export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`

/** Digits only, with India country code, for wa.me and tel: links. */
export const phoneDigits = (phone: string | null | undefined) => {
  const d = (phone ?? '').replace(/\D/g, '')
  return d.length === 10 ? `91${d}` : d
}

export const telHref = (phone: string | null | undefined) => `tel:+${phoneDigits(phone)}`

/** WhatsApp link with a pre-filled message naming what the visitor was looking at. */
export const whatsappHref = (whatsapp: string | null | undefined, text: string) =>
  `https://wa.me/${phoneDigits(whatsapp)}?text=${encodeURIComponent(text)}`
