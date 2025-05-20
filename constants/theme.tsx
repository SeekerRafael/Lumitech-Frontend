import { StyleSheet } from "react-native";

export const colors = {
  background: "#FFFFFF",
  backgroundHome: "#03045E",
  primary: "#0077B6",
  inputColor: "#90E0EF",
  white: "#FFFFFF",
  colorLetter: "#000000",
  error: "#FF4D4D",
  cardRow: "#E0F7FA",
  cardBackground: "#FFFFFF",
};

export const animation = StyleSheet.create({
  containerAnimation: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: "center",
  },
  titleAnimation: {
    fontSize: 22,
    color: colors.colorLetter,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  stepContainerAnimation: {
    marginBottom: 30,
    alignItems: "center",
  },
  stepTitleAnimation: {
    fontSize: 18,
    color: colors.primary,
    marginBottom: 10,
  },
  highlightTextAnimation: {
    fontSize: 16,
    color: colors.primary,
    textAlign: "center",
  },
});

export const theme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  homeContainer: {
    flex: 1,
    backgroundColor: colors.backgroundHome,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logoPrincipal: {
    width: 250,
    height: 250,
    marginBottom: 20,
    alignSelf: "center",
  },
  logoSecundario: {
    width: 100,
    height: 100,
    marginBottom: 10,
    alignSelf: "center",
  },
  logoTerciario: {
    width: 40,
    height: 40,
    alignSelf: "center",
    padding: 10,
  },
  appName: {
    fontSize: 40,
    color: colors.white,
    marginBottom: 40,
    textAlign: "center",
  },
  appNameS: {
    fontSize: 20,
    color: colors.backgroundHome,
    marginTop: 0,
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.colorLetter,
    marginBottom: 20,
    marginTop: 0,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10,
    width: "90%",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
  },
  activeToggle: {
    borderColor: colors.primary,
  },
  toggleText: {
    fontSize: 16,
    color: "#666",
  },
  activeToggleText: {
    color: colors.primary,
    fontWeight: "bold",
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.inputColor,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: colors.inputColor,
    paddingHorizontal: 10,
    width: "90%",
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
  },
  iconButton: {
    padding: 4,
  },
  forgotPasswordLink: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: colors.primary,
    textDecorationLine: "underline",
  },
  errorText: {
    color: colors.error,
    marginBottom: 10,
    width: "90%",
  },
  loader: {
    marginTop: 20,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 10,
    alignItems: "center",
  },
  registerContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    fontSize: 16,
    color: colors.colorLetter,
    marginBottom: 5,
    textAlign: "center",
  },
  verifyEmailLink: {
    marginTop: 15,
  },
  verifyEmailText: {
    color: colors.primary,
    textDecorationLine: "underline",
    textAlign: "center",
  },
  fieldContainer: {
    width: "100%",
    alignItems: "center",
  },

  label: {
    width: "90%",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
    textAlign: "left",
  },
  labelText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
    textAlign: "center",
  },
  link: {
    color: "#007BFF",
    textDecorationLine: "underline",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  cancelButton: {
    marginRight: 10,
  },
  cancelText: {
    color: "#666",
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  sendText: {
    color: "#fff",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 5,
    marginTop: 1,
  },
  settingsButton: {
    padding: 10,
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingTop: 20,
  },
  userInfo: {
    fontSize: 16,
    marginVertical: 8,
    color: colors.colorLetter,
    textAlign: "center",
  },

  menuItem: {
    color: colors.colorLetter,
  },
  menuItemDanger: {
    color: colors.error,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.colorLetter,
    marginBottom: 20,
    textAlign: "center",
  },
  menuItemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.colorLetter,
  },
  menuItemDangerText: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.error,
  },
  containerSecundario: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 10,
  },
  titleSecundario: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  labelSecundario: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: "#222",
    flex: 1,
    textAlign: "right",
    marginRight: 10,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 20,
  },
  leftButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  rightButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  buttonTextS: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "bold",
    margin: 0,
    padding: 0,
  },
  rowLeftAligned: {
    flexDirection: "row",
    alignSelf: "flex-start",
    marginBottom: 10,
    width: "90%",
  },

  rowLabelText: {
    fontSize: 14,
    color: colors.colorLetter,
    marginRight: 5,
  },

  containerTerciario: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    paddingTop: 40,
  },
});
