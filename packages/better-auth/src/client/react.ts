import type { BetterFetchOption } from "@better-fetch/fetch";
import { useStore } from "@nanostores/react";
import type { BetterAuth } from "../auth";
import type { InferSession, InferUser } from "../types";
import { createAuthClient as createVanillaClient } from "./base";

export const createAuthClient = <Auth extends BetterAuth>(
	options?: BetterFetchOption,
) => {
	const client = createVanillaClient<Auth>(options);
	function useSession(
		initialValue: {
			user: InferUser<Auth>;
			session: InferSession<Auth>;
		} | null = null,
	) {
		const session = useStore(client.$atoms.$session);
		if (session) {
			return session;
		}
		return initialValue;
	}
	function useActiveOrganization() {
		return useStore(client.$atoms.$activeOrganization);
	}
	function useListOrganization() {
		return useStore(client.$atoms.$listOrganizations);
	}
	function useInvitation() {
		return (
			useAuthStore(client.$atoms.$invitation) || {
				error: null,
				data: null,
			}
		);
	}

	const obj = Object.assign(client, {
		useSession,
		useActiveOrganization,
		useListOrganization,
		useInvitation,
	});
	return obj;
};

export const useAuthStore = useStore;