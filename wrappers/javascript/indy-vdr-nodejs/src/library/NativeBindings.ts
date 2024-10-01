import type { ByteBuffer } from '../ffi'

export interface NativeMethods {
  indy_vdr_set_config: (arg0: string) => number
  indy_vdr_set_cache_directory: (arg0: string) => number
  indy_vdr_set_ledger_txn_cache: (
    arg0: number,
    arg1: number,
    arg2?: string,
  ) => number
  indy_vdr_set_default_logger: () => number
  indy_vdr_set_protocol_version: (arg0: number) => number
  indy_vdr_set_socks_proxy: (arg0: string) => number
  indy_vdr_version: () => string
  indy_vdr_get_current_error: (arg0: Buffer) => number
  indy_vdr_build_acceptance_mechanisms_request: (
    arg0: string,
    arg1: string,
    arg2: string,
    arg3: string,
    requestHandlePtr: Buffer,
  ) => number
  indy_vdr_build_attrib_request: (
    arg0: string,
    arg1: string,
    arg2: string,
    arg3: string,
    arg4: string,
    requestHandlePtr: Buffer,
  ) => number
  indy_vdr_build_cred_def_request: (
    arg0: string,
    arg1: string,
    requestHandlePtr: Buffer,
  ) => number
  indy_vdr_build_custom_request: (
    arg0: string,
    requestHandlePtr: Buffer,
  ) => number
  indy_vdr_build_disable_all_txn_author_agreements_request: (
    arg0: string,
    requestHandlePtr: Buffer,
  ) => number
  indy_vdr_build_get_acceptance_mechanisms_request: (
    arg0: string,
    arg1: number,
    arg2: string,
    requestHandlePtr: Buffer,
  ) => number
  indy_vdr_build_get_cred_def_request: (
    arg0: string,
    arg1: string,
    requestHandlePtr: Buffer,
  ) => number
  indy_vdr_build_get_revoc_reg_def_request: (
    arg0: string,
    arg1: string,
    requestHandlePtr: Buffer,
  ) => number
  indy_vdr_build_get_revoc_reg_delta_request: (
    arg0: string,
    arg1: string,
    arg2: number,
    arg3: number,
    requestHandlePtr: Buffer,
  ) => number
  indy_vdr_build_get_revoc_reg_request: (
    arg0: string,
    arg1: string,
    arg2: number,
    requestHandlePtr: Buffer,
  ) => number
  indy_vdr_build_get_schema_request: (
    arg0: string,
    arg1: string,
    requestHandlePtr: Buffer,
  ) => number
  indy_vdr_build_get_attrib_request: (
    arg0: string,
    arg1: string,
    arg2: string,
    arg3: string,
    arg4: string,
    arg5: number,
    arg6: number,
    requestHandlePtr: Buffer,
  ) => number
  indy_vdr_build_node_request: (
    arg0: string,
    arg1: string,
    arg2: string,
    requestHandlePtr: Buffer,
  ) => number
  indy_vdr_build_pool_config_request: (
    arg0: string,
    arg1: string,
    requestHandlePtr: Buffer,
  ) => number
  indy_vdr_build_revoc_reg_def_request: (
    arg0: string,
    arg1: string,
    requestHandlePtr: Buffer,
  ) => number
  indy_vdr_build_revoc_reg_entry_request: (
    arg0: string,
    arg1: string,
    arg2: string,
    arg3: string,
    requestHandlePtr: Buffer,
  ) => number
  indy_vdr_build_schema_request: (
    arg0: string,
    arg1: string,
    requestHandlePtr: Buffer,
  ) => number
  indy_vdr_build_txn_author_agreement_request: (
    arg0: string,
    arg1: string,
    arg2: string,
    arg3: number,
    arg4: number,
    requestHandlePtr: Buffer,
  ) => number
  indy_vdr_build_get_txn_author_agreement_request: (
    arg0: string,
    arg1: string,
    requestHandlePtr: Buffer,
  ) => number
  indy_vdr_build_get_nym_request: (
    arg0: string,
    arg1: string,
    arg2: number,
    arg3: number,
    requestHandlePtr: Buffer,
  ) => number
  indy_vdr_build_get_txn_request: (
    arg0: string,
    arg1: number,
    arg2: number,
    requestHandlePtr: Buffer,
  ) => number
  indy_vdr_build_get_validator_info_request: (
    arg0: string,
    requestHandlePtr: Buffer,
  ) => number
  indy_vdr_build_nym_request: (
    arg0: string,
    arg1: string,
    arg2: string,
    arg3: string,
    arg4: string,
    arg5: string,
    arg6: number,
    requestHandlePtr: Buffer,
  ) => number
  indy_vdr_pool_create: (arg0: string, poolHandlePtr: Buffer) => number
  indy_vdr_pool_close: (poolHandle: number) => number
  indy_vdr_pool_refresh: (
    poolHandle: number,
    callBackPtr: Buffer,
    callbackId: number,
  ) => number
  indy_vdr_pool_submit_action: (
    poolHandle: number,
    requestHandle: number,
    arg0: string,
    arg1: number,
    callBackPtr: Buffer,
    callbackId: number,
  ) => number
  indy_vdr_pool_submit_request: (
    poolHandle: number,
    requestHandle: number,
    callBackPtr: Buffer,
    callbackId: number,
  ) => number
  indy_vdr_pool_get_status: (
    poolHandle: number,
    callBackPtr: Buffer,
    callbackId: number,
  ) => number
  indy_vdr_pool_get_transactions: (
    poolHandle: number,
    callBackPtr: Buffer,
    callbackId: number,
  ) => number
  indy_vdr_pool_get_verifiers: (
    poolHandle: number,
    callBackPtr: Buffer,
    callbackId: number,
  ) => number
  indy_vdr_prepare_txn_author_agreement_acceptance: (
    arg0: string,
    arg1: string,
    arg2: string,
    arg3: string,
    arg4: number,
    outputPtr: Buffer,
  ) => number
  indy_vdr_request_free: (requestHandle: number) => number
  indy_vdr_request_get_body: (
    requestHanlde: number,
    outputPtr: Buffer,
  ) => number
  indy_vdr_request_get_signature_input: (
    requestHandle: number,
    outputPtr: Buffer,
  ) => number
  indy_vdr_request_set_endorser: (requestHandle: number, arg0: string) => number
  indy_vdr_request_set_multi_signature: (
    requestHandle: number,
    arg0: string,
    arg1: typeof ByteBuffer,
  ) => number
  indy_vdr_request_set_signature: (
    requestHandle: number,
    arg0: typeof ByteBuffer,
  ) => number
  indy_vdr_request_set_txn_author_agreement_acceptance: (
    requestHandle: number,
    arg0: string,
  ) => number
}
