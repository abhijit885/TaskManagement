if(NOT TARGET react-native-worklets::worklets)
add_library(react-native-worklets::worklets SHARED IMPORTED)
set_target_properties(react-native-worklets::worklets PROPERTIES
    IMPORTED_LOCATION "/Users/cn17/Workspace/React_Native/ASSIGNMENT/TaskManagement/node_modules/react-native-worklets/android/build/intermediates/cxx/Debug/5k443r58/obj/arm64-v8a/libworklets.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/cn17/Workspace/React_Native/ASSIGNMENT/TaskManagement/node_modules/react-native-worklets/android/build/prefab-headers/worklets"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

