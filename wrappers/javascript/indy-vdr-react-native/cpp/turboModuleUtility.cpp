#include "turboModuleUtility.h"

namespace indyVdrTurboModuleUtility {

std::shared_ptr<react::CallInvoker> invoker;

void registerTurboModule(jsi::Runtime &rt,
                         std::shared_ptr<react::CallInvoker> jsCallInvoker) {
  // Setting the callInvoker for async code
  invoker = jsCallInvoker;
  // Create a TurboModuleRustHostObject
  auto instance = std::make_shared<IndyVdrTurboModuleHostObject>(rt);
  // Create a JS equivalent object of the instance
  jsi::Object jsInstance = jsi::Object::createFromHostObject(rt, instance);
  // Register the object on global
  rt.global().setProperty(rt, "_indy_vdr", std::move(jsInstance));
}

void assertValueIsObject(jsi::Runtime &rt, const jsi::Value *val) {
  val->asObject(rt);
}

template <>
jsi::Value createReturnValue(jsi::Runtime &rt, ErrorCode code,
                             nullptr_t value) {
  auto object = jsi::Object(rt);

  if (code == ErrorCode::Success) {
    object.setProperty(rt, "value", jsi::Value::null());
  }

  object.setProperty(rt, "errorCode", int(code));

  return object;
}

template <>
jsi::Value createReturnValue(jsi::Runtime &rt, ErrorCode code, int64_t *out) {
  auto object = jsi::Object(rt);

  if (code == ErrorCode::Success) {
    auto valueWithoutNullptr =
        out == nullptr ? jsi::Value::null() : jsi::Value(rt, int(*out));
    object.setProperty(rt, "value", valueWithoutNullptr);
  }

  object.setProperty(rt, "errorCode", int(code));

  return object;
}

template <>
jsi::Value createReturnValue(jsi::Runtime &rt, ErrorCode code,
                             const char **value) {
  auto object = jsi::Object(rt);

  if (code == ErrorCode::Success) {
    auto isNullptr = value == nullptr || *value == nullptr;
    auto valueWithoutNullptr = isNullptr
                                   ? jsi::Value::null()
                                   : jsi::String::createFromAscii(rt, *value);
    object.setProperty(rt, "value", valueWithoutNullptr);
  }

  object.setProperty(rt, "errorCode", int(code));

  return object;
}

template <>
jsi::Value createReturnValue(jsi::Runtime &rt, ErrorCode code,
                             const char *const *value) {
  auto object = jsi::Object(rt);

  if (code == ErrorCode::Success) {
    auto isNullptr = value == nullptr || *value == nullptr;
    auto valueWithoutNullptr = isNullptr
                                   ? jsi::Value::null()
                                   : jsi::String::createFromAscii(rt, *value);
    object.setProperty(rt, "value", valueWithoutNullptr);
  }

  object.setProperty(rt, "errorCode", int(code));

  return object;
}

void callback(CallbackId result, ErrorCode code) {
  invoker->invokeAsync([result, code]() {
    State *_state = reinterpret_cast<State *>(result);
    State *state = static_cast<State *>(_state);
    jsi::Function *cb = &state->cb;
    jsi::Runtime *rt = reinterpret_cast<jsi::Runtime *>(state->rt);

    auto object = jsi::Object(*rt);
    object.setProperty(*rt, "errorCode", int(code));
    cb->call(*rt, object);
  });
}

void callbackWithResponse(CallbackId result, ErrorCode code,
                          const char *response) {
  invoker->invokeAsync([result, code, response]() {
    State *_state = reinterpret_cast<State *>(result);
    State *state = static_cast<State *>(_state);
    jsi::Function *cb = &state->cb;
    jsi::Runtime *rt = reinterpret_cast<jsi::Runtime *>(state->rt);

    auto out = createReturnValue(*rt, code, &response);
    cb->call(*rt, out);
  });
}

template <>
uint8_t jsiToValue(jsi::Runtime &rt, jsi::Object &options, const char *name,
                   bool optional) {
  jsi::Value value = options.getProperty(rt, name);
  if ((value.isNull() || value.isUndefined()) && optional)
    return -1;

  if (value.isNumber())
    return value.asNumber();

  throw jsi::JSError(rt, errorPrefix + name + errorInfix + "number");
};

template <>
std::string jsiToValue<std::string>(jsi::Runtime &rt, jsi::Object &options,
                                    const char *name, bool optional) {
  jsi::Value value = options.getProperty(rt, name);

  if ((value.isNull() || value.isUndefined()) && optional)
    return std::string();

  if (value.isString())
    return value.asString(rt).utf8(rt);

  throw jsi::JSError(rt, errorPrefix + name + errorInfix + "string");
}

template <>
int64_t jsiToValue(jsi::Runtime &rt, jsi::Object &options, const char *name,
                   bool optional) {
  jsi::Value value = options.getProperty(rt, name);
  if ((value.isNull() || value.isUndefined()) && optional)
    return -1;

  if (value.isNumber())
    return value.asNumber();

  throw jsi::JSError(rt, errorPrefix + name + errorInfix + "number");
};

template <>
uint64_t jsiToValue(jsi::Runtime &rt, jsi::Object &options, const char *name,
                    bool optional) {
  jsi::Value value = options.getProperty(rt, name);
  if ((value.isNull() || value.isUndefined()) && optional)
    return 0;

  if (value.isNumber())
    return value.asNumber();

  throw jsi::JSError(rt, errorPrefix + name + errorInfix + "number");
};

template <>
int32_t jsiToValue(jsi::Runtime &rt, jsi::Object &options, const char *name,
                   bool optional) {
  jsi::Value value = options.getProperty(rt, name);
  if ((value.isNull() || value.isUndefined()) && optional)
    return -1;

  if (value.isNumber())
    return value.asNumber();

  throw jsi::JSError(rt, errorPrefix + name + errorInfix + "number");
};

template <>
uint32_t jsiToValue(jsi::Runtime &rt, jsi::Object &options, const char *name,
                    bool optional) {
  jsi::Value value = options.getProperty(rt, name);
  if ((value.isNull() || value.isUndefined()) && optional)
    return 0;

  if (value.isNumber())
    return value.asNumber();

  throw jsi::JSError(rt, errorPrefix + name + errorInfix + "number");
};

template <>
std::vector<int32_t>
jsiToValue<std::vector<int32_t>>(jsi::Runtime &rt, jsi::Object &options,
                                 const char *name, bool optional) {
  jsi::Value value = options.getProperty(rt, name);

  if (value.isObject() && value.asObject(rt).isArray(rt)) {
    std::vector<int32_t> vec = {};
    jsi::Array arr = value.asObject(rt).asArray(rt);
    size_t length = arr.length(rt);
    for (int i = 0; i < length; i++) {
      jsi::Value element = arr.getValueAtIndex(rt, i);
      if (element.isNumber()) {
        vec.push_back(element.asNumber());
      } else {
        throw jsi::JSError(rt, errorPrefix + name + errorInfix + "number");
      }
    }
    return vec;
  }

  if (optional)
    return {};

  throw jsi::JSError(rt, errorPrefix + name + errorInfix + "Array<number>");
}

template <>
ByteBuffer jsiToValue<ByteBuffer>(jsi::Runtime &rt, jsi::Object &options,
                                  const char *name, bool optional) {
  jsi::Value value = options.getProperty(rt, name);

  if (value.isObject() && value.asObject(rt).isArrayBuffer(rt)) {
    jsi::ArrayBuffer arrayBuffer = value.getObject(rt).getArrayBuffer(rt);
    return ByteBuffer{int(arrayBuffer.size(rt)), arrayBuffer.data(rt)};
  }

  if (optional)
    return ByteBuffer{0, 0};

  throw jsi::JSError(rt, errorPrefix + name + errorInfix + "Uint8Array");
}

} // namespace indyVdrTurboModuleUtility
