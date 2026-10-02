import Loader from "@/components/loader";
import { LoginShell } from "./login-shell";

// Único fallback do /login: loading.tsx, o Suspense do page.tsx e o form
// enquanto a sessão carrega mostram a mesma moldura, sem salto de layout.
export function LoginFallback() {
	return (
		<LoginShell>
			<Loader />
		</LoginShell>
	);
}
