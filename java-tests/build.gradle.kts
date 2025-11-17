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
    mavenCentral()
}

dependencies {
    // Spring Boot WebFlux for reactive HTTP client
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    
    // Spring GraphQL
    implementation("org.springframework.graphql:spring-graphql:1.2.6")
    
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

