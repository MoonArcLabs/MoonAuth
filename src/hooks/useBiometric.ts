import { useState, useEffect, useCallback } from 'react'

export function useBiometric() {
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      .then(setAvailable)
      .catch(() => setAvailable(false))
  }, [])

  const authenticate = useCallback(async (): Promise<boolean> => {
    if (!available) return false
    try {
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          rpId: window.location.hostname,
          userVerification: 'required',
          timeout: 60000,
          allowCredentials: [],
        },
      })
      return !!credential
    } catch {
      return false
    }
  }, [available])

  return { available, authenticate }
}
