export const styles = {
  container: {
    transition: "margin-left 0.3s ease",
  } as const,
  headerContainer: {
    backgroundColor: "#fff",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: "30px",
    padding: "10px",
    width: "70%",
    height: "140px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: "60px",
  },
  headerTitle: {
    fontSize: "14px",
    color: "#ACACAC",
  },
  statusTextContainer: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "16px",
  },
  statusContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "16px",
    gap: "12px",
  },
  statusNumber: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  divider: {
    height: "80px",
    width: "1px",
    backgroundColor: "#E0E0E0",
    marginRight: "30px",
  },
  serviceTotal: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "33%",
    marginLeft: "30px",
  },
  clientTotal: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "33%",
  },
  monthServiceTotal: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "33%",
  },
};
