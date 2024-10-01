import type { IndyVdr } from '../types'

export let indyVdr: IndyVdr

export const registerIndyVdr = ({ vdr }: { vdr: IndyVdr }) => {
  indyVdr = vdr
}
