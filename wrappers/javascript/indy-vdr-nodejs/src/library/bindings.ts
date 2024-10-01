import {
  FFI_ERROR_CODE,
  FFI_STRING,
  FFI_INT64,
  FFI_STRING_PTR,
  FFI_REQUEST_HANDLE_POINTER,
  FFI_INT32,
  FFI_HANDLE_POINTER,
  FFI_POOL_HANDLE,
  FFI_CALLBACK_PTR,
  FFI_CALLBACK_ID,
  FFI_REQUEST_HANDLE,
  FFI_UINT64,
  ByteBuffer,
} from '../ffi'

export const nativeBindings = {
  // first element is method return type, second element is list of method argument types
  indy_vdr_set_config: [FFI_ERROR_CODE, [FFI_STRING]],
  indy_vdr_set_default_logger: [FFI_ERROR_CODE, []],
  indy_vdr_set_protocol_version: [FFI_ERROR_CODE, [FFI_INT64]],
  indy_vdr_set_socks_proxy: [FFI_ERROR_CODE, [FFI_STRING]],
  indy_vdr_version: [FFI_STRING, []],
  indy_vdr_get_current_error: [FFI_ERROR_CODE, [FFI_STRING_PTR]],

  // cache
  indy_vdr_set_ledger_txn_cache: [FFI_ERROR_CODE, [FFI_INT64, FFI_INT64, FFI_STRING]],

  // requests
  indy_vdr_build_acceptance_mechanisms_request: [
    FFI_ERROR_CODE,
    [FFI_STRING, FFI_STRING, FFI_STRING, FFI_STRING, FFI_REQUEST_HANDLE_POINTER],
  ],
  indy_vdr_build_attrib_request: [
    FFI_ERROR_CODE,
    [FFI_STRING, FFI_STRING, FFI_STRING, FFI_STRING, FFI_STRING, FFI_REQUEST_HANDLE_POINTER],
  ],
  indy_vdr_build_cred_def_request: [FFI_ERROR_CODE, [FFI_STRING, FFI_STRING, FFI_REQUEST_HANDLE_POINTER]],
  indy_vdr_build_custom_request: [FFI_ERROR_CODE, [FFI_STRING, FFI_REQUEST_HANDLE_POINTER]],
  indy_vdr_build_disable_all_txn_author_agreements_request: [FFI_ERROR_CODE, [FFI_STRING, FFI_REQUEST_HANDLE_POINTER]],
  indy_vdr_build_get_acceptance_mechanisms_request: [
    FFI_ERROR_CODE,
    [FFI_STRING, FFI_INT64, FFI_STRING, FFI_REQUEST_HANDLE_POINTER],
  ],
  indy_vdr_build_get_attrib_request: [
    FFI_ERROR_CODE,
    [FFI_STRING, FFI_STRING, FFI_STRING, FFI_STRING, FFI_STRING, FFI_INT32, FFI_INT64, FFI_REQUEST_HANDLE_POINTER],
  ],
  indy_vdr_build_get_cred_def_request: [FFI_ERROR_CODE, [FFI_STRING, FFI_STRING, FFI_REQUEST_HANDLE_POINTER]],
  indy_vdr_build_get_nym_request: [
    FFI_ERROR_CODE,
    [FFI_STRING, FFI_STRING, FFI_INT32, FFI_INT64, FFI_REQUEST_HANDLE_POINTER],
  ],
  indy_vdr_build_get_revoc_reg_def_request: [FFI_ERROR_CODE, [FFI_STRING, FFI_STRING, FFI_REQUEST_HANDLE_POINTER]],
  indy_vdr_build_get_revoc_reg_delta_request: [
    FFI_ERROR_CODE,
    [FFI_STRING, FFI_STRING, FFI_INT64, FFI_INT64, FFI_REQUEST_HANDLE_POINTER],
  ],
  indy_vdr_build_get_revoc_reg_request: [
    FFI_ERROR_CODE,
    [FFI_STRING, FFI_STRING, FFI_INT64, FFI_REQUEST_HANDLE_POINTER],
  ],
  indy_vdr_build_get_schema_request: [FFI_ERROR_CODE, [FFI_STRING, FFI_STRING, FFI_REQUEST_HANDLE_POINTER]],
  indy_vdr_build_txn_author_agreement_request: [
    FFI_ERROR_CODE,
    [FFI_STRING, FFI_STRING, FFI_STRING, FFI_INT64, FFI_INT64, FFI_REQUEST_HANDLE_POINTER],
  ],
  indy_vdr_build_get_txn_author_agreement_request: [
    FFI_ERROR_CODE,
    [FFI_STRING, FFI_STRING, FFI_REQUEST_HANDLE_POINTER],
  ],
  indy_vdr_build_get_txn_request: [FFI_ERROR_CODE, [FFI_STRING, FFI_INT32, FFI_INT32, FFI_REQUEST_HANDLE_POINTER]],
  indy_vdr_build_get_validator_info_request: [FFI_ERROR_CODE, [FFI_STRING, FFI_REQUEST_HANDLE_POINTER]],
  indy_vdr_build_nym_request: [
    FFI_ERROR_CODE,
    [FFI_STRING, FFI_STRING, FFI_STRING, FFI_STRING, FFI_STRING, FFI_STRING, FFI_INT32, FFI_REQUEST_HANDLE_POINTER],
  ],
  indy_vdr_build_revoc_reg_def_request: [FFI_ERROR_CODE, [FFI_STRING, FFI_STRING, FFI_REQUEST_HANDLE_POINTER]],
  indy_vdr_build_revoc_reg_entry_request: [
    FFI_ERROR_CODE,
    [FFI_STRING, FFI_STRING, FFI_STRING, FFI_STRING, FFI_REQUEST_HANDLE_POINTER],
  ],
  indy_vdr_build_schema_request: [FFI_ERROR_CODE, [FFI_STRING, FFI_STRING, FFI_REQUEST_HANDLE_POINTER]],

  // pool
  indy_vdr_pool_create: [FFI_ERROR_CODE, [FFI_STRING, FFI_HANDLE_POINTER]],
  indy_vdr_pool_close: [FFI_ERROR_CODE, [FFI_POOL_HANDLE]],
  indy_vdr_pool_refresh: [FFI_ERROR_CODE, [FFI_POOL_HANDLE, FFI_CALLBACK_PTR, FFI_CALLBACK_ID]],
  indy_vdr_pool_submit_action: [
    FFI_ERROR_CODE,
    [FFI_POOL_HANDLE, FFI_REQUEST_HANDLE, FFI_STRING, FFI_INT32, FFI_CALLBACK_PTR, FFI_CALLBACK_ID],
  ],
  indy_vdr_pool_submit_request: [
    FFI_ERROR_CODE,
    [FFI_POOL_HANDLE, FFI_REQUEST_HANDLE, FFI_CALLBACK_PTR, FFI_CALLBACK_ID],
  ],
  indy_vdr_pool_get_status: [FFI_ERROR_CODE, [FFI_POOL_HANDLE, FFI_CALLBACK_PTR, FFI_CALLBACK_ID]],
  indy_vdr_pool_get_transactions: [FFI_ERROR_CODE, [FFI_POOL_HANDLE, FFI_CALLBACK_PTR, FFI_CALLBACK_ID]],
  indy_vdr_pool_get_verifiers: [FFI_ERROR_CODE, [FFI_POOL_HANDLE, FFI_CALLBACK_PTR, FFI_CALLBACK_ID]],

  indy_vdr_prepare_txn_author_agreement_acceptance: [
    FFI_ERROR_CODE,
    [FFI_STRING, FFI_STRING, FFI_STRING, FFI_STRING, FFI_UINT64, FFI_STRING_PTR],
  ],
  indy_vdr_request_free: [FFI_ERROR_CODE, [FFI_REQUEST_HANDLE]],
  indy_vdr_request_get_body: [FFI_ERROR_CODE, [FFI_REQUEST_HANDLE, FFI_STRING_PTR]],
  indy_vdr_request_get_signature_input: [FFI_ERROR_CODE, [FFI_REQUEST_HANDLE, FFI_STRING_PTR]],
  indy_vdr_request_set_endorser: [FFI_ERROR_CODE, [FFI_REQUEST_HANDLE, FFI_STRING]],
  indy_vdr_request_set_multi_signature: [FFI_ERROR_CODE, [FFI_REQUEST_HANDLE, FFI_STRING, ByteBuffer]],
  indy_vdr_request_set_signature: [FFI_ERROR_CODE, [FFI_REQUEST_HANDLE, ByteBuffer]],
  indy_vdr_request_set_txn_author_agreement_acceptance: [FFI_ERROR_CODE, [FFI_REQUEST_HANDLE, FFI_STRING]],
} as const
