# Bot para Discord

## Variáveis de ambiente necessárias

```bash
DISCORD_TOKEN=token MODEL_API_URL=http://localhost:9000 THRESHOLD=0.5 CURUPIRA_RESET=true
```

## Como executar usando o Gradle

```bash
./gradlew run
```

## Como gerar o .jar

```bash
./gradlew deploy
```

## Como executar o .jar usando as variáveis de ambiente
```bash
DISCORD_TOKEN=token MODEL_API_URL=http://localhost:9000 THRESHOLD=0.5 CURUPIRA_RESET=true java -jar SaCiPeReReDiscordBot.jar
```
