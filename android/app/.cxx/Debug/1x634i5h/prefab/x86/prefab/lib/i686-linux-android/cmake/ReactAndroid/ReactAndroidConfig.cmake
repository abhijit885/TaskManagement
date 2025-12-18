if(NOT TARGET ReactAndroid::hermestooling)
add_library(ReactAndroid::hermestooling SHARED IMPORTED)
set_target_properties(ReactAndroid::hermestooling PROPERTIES
    IMPORTED_LOCATION "/Users/cn17/.gradle/caches/9.0.0/transforms/03af8f891852ac3caafb4193b7be74e9/transformed/react-android-0.83.0-debug/prefab/modules/hermestooling/libs/android.x86/libhermestooling.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/cn17/.gradle/caches/9.0.0/transforms/03af8f891852ac3caafb4193b7be74e9/transformed/react-android-0.83.0-debug/prefab/modules/hermestooling/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

if(NOT TARGET ReactAndroid::jsi)
add_library(ReactAndroid::jsi SHARED IMPORTED)
set_target_properties(ReactAndroid::jsi PROPERTIES
    IMPORTED_LOCATION "/Users/cn17/.gradle/caches/9.0.0/transforms/03af8f891852ac3caafb4193b7be74e9/transformed/react-android-0.83.0-debug/prefab/modules/jsi/libs/android.x86/libjsi.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/cn17/.gradle/caches/9.0.0/transforms/03af8f891852ac3caafb4193b7be74e9/transformed/react-android-0.83.0-debug/prefab/modules/jsi/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

if(NOT TARGET ReactAndroid::reactnative)
add_library(ReactAndroid::reactnative SHARED IMPORTED)
set_target_properties(ReactAndroid::reactnative PROPERTIES
    IMPORTED_LOCATION "/Users/cn17/.gradle/caches/9.0.0/transforms/03af8f891852ac3caafb4193b7be74e9/transformed/react-android-0.83.0-debug/prefab/modules/reactnative/libs/android.x86/libreactnative.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/cn17/.gradle/caches/9.0.0/transforms/03af8f891852ac3caafb4193b7be74e9/transformed/react-android-0.83.0-debug/prefab/modules/reactnative/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

