# 📺 Sintonia TV - App Mobile & TV Box

## Configuração para TV Box / Android TV

Este app foi otimizado para funcionar em **TV Boxes e Android TV** com navegação por controle remoto.

### Recursos de TV

- ✅ **Navegação D-pad** (↑↓←→ + OK)
- ✅ **Foco visual** em botões e cards
- ✅ **Layout landscape** otimizado para telas grandes
- ✅ **Controles de player** acessíveis por controle remoto
- ✅ **Ícone na tela inicial da TV** (Leanback Launcher)

### Build para TV Box

```bash
# 1. Instalar dependências
npm install

# 2. Configurar API
# Edite src/services/api.js e coloque a URL do seu backend

# 3. Gerar APK via EAS (nuvem da Expo)
npm install -g eas-cli
eas login
eas build:configure

# APK para teste
eas build -p android --profile preview

# APK/AAB para produção
eas build -p android --profile production
```

### Build Local (requer Android Studio)

```bash
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
# APK em: android/app/build/outputs/apk/release/app-release.apk
```

### Instalar na TV Box

1. Ative **"Fontes desconhecidas"** nas configurações da TV Box
2. Transfira o APK via pendrive ou `adb install app-release.apk`
3. O app aparecerá na tela inicial da TV!

### Configurações do app.json para TV

O `app.json` já está configurado com:
- `orientation: "landscape"`
- `intentFilters` com `LEANBACK_LAUNCHER`
- Ícones otimizados para TV
