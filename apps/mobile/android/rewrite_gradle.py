from pathlib import Path
from textwrap import dedent

content = dedent("""
// File: android/build.gradle  (root project, RN 0.75.x stack)

buildscript {
  ext {
    buildToolsVersion = \"34.0.0\"
    minSdkVersion = 23
    compileSdkVersion = 34
    targetSdkVersion = 34
    ndkVersion = \"25.2.9519653\"
    kotlinVersion = \"1.9.24\"
  }
  repositories {
    google()
    mavenCentral()
  }
  dependencies {
    classpath(\"com.android.tools.build:gradle:8.5.2\")
    classpath(\"com.facebook.react:react-native-gradle-plugin\")
    classpath(\"org.jetbrains.kotlin:kotlin-gradle-plugin:__KOTLIN__\")
  }
}

apply plugin: \"com.facebook.react.rootproject\"
""")
content = content.replace('__KOTLIN__', '${kotlinVersion}')
Path('build.gradle').write_text(content, encoding='utf-8')
