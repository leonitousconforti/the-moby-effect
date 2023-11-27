# TODO: Keep this updated with the latest version of the swagger-codegen-cli.jar
wget https://repo1.maven.org/maven2/io/swagger/codegen/v3/swagger-codegen-cli/3.0.51/swagger-codegen-cli-3.0.51.jar -O swagger-codegen-cli.jar

java -jar swagger-codegen-cli.jar generate --input-spec ./swagger.yaml --output ./src --lang typescript-fetch -c ./swagger-gen.yaml
