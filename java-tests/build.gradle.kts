plugins {
    java
    id("org.springframework.boot") version "3.4.0"
    id("io.spring.dependency-management") version "1.1.6"
}

group = "com.administrate"
version = "1.0.0"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(25)
    }
}

repositories {
    mavenLocal()
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-graphql")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:2.19.2")
    implementation("com.graphql-java:graphql-java:20.0")
    implementation("com.graphql-java-generator:graphql-java-client-runtime:2.9")
    implementation("com.example:administrate-graphql-client:1.0.0")
    implementation("org.projectlombok:lombok:1.18.42")
    annotationProcessor("org.projectlombok:lombok:1.18.42")
    implementation("com.graphql-java:java-dataloader:6.0.0")

    implementation("org.springframework.boot:spring-boot-starter-webflux")

    // Jackson for JSON
    implementation("com.fasterxml.jackson.core:jackson-databind")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310")
    
    // ASM for Java 25 class file support - force newer version
    implementation("org.ow2.asm:asm:9.7.1")
    implementation("org.ow2.asm:asm-commons:9.7.1")
    configurations.all {
        resolutionStrategy {
            force("org.ow2.asm:asm:9.7.1")
            force("org.ow2.asm:asm-commons:9.7.1")
            force("org.ow2.asm:asm-tree:9.7.1")
        }
    }
    
    // Test dependencies
    testImplementation("org.springframework.boot:spring-boot-starter-test") {
        exclude(group = "org.junit.vintage", module = "junit-vintage-engine")
    }
    testImplementation("org.junit.jupiter:junit-jupiter")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
    testImplementation("org.assertj:assertj-core")
    testImplementation("io.projectreactor:reactor-test")
    testImplementation("org.mockito:mockito-inline:5.2.0")
    // ByteBuddy agent for Mockito (required for static mocking and final class mocking)
    // Using the same version that mockito-inline depends on
    testImplementation("net.bytebuddy:byte-buddy-agent")
}

tasks.withType<JavaCompile> {
    options.encoding = "UTF-8"
}

tasks.withType<Test> {
    useJUnitPlatform()
    javaLauncher.set(javaToolchains.launcherFor {
        languageVersion.set(JavaLanguageVersion.of(25))
        vendor.set(org.gradle.jvm.toolchain.JvmVendorSpec.AMAZON)
    })
    systemProperty("spring.classformat.ignore", "true")
    
    // Mockito agent for static mocking and final class mocking
    val byteBuddyAgent = configurations.testRuntimeClasspath.get().files.find { it.name.contains("byte-buddy-agent") }
    if (byteBuddyAgent != null) {
        jvmArgs("-javaagent:${byteBuddyAgent.absolutePath}")
    }
    
    // Disable test result caching - always run tests fresh after clean
    outputs.upToDateWhen { false }
    
    // Show test output
    testLogging {
        events("skipped", "failed")
        exceptionFormat = org.gradle.api.tasks.testing.logging.TestExceptionFormat.FULL
        showStandardStreams = true
    }
}

tasks.named<org.springframework.boot.gradle.tasks.bundling.BootJar>("bootJar") {
    enabled = false
}

tasks.named("bootRun") {
    enabled = false
}

tasks.named("resolveMainClassName") {
    enabled = false
}

tasks.named<Jar>("jar") {
    enabled = true
}
