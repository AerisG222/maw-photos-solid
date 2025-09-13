import { Component, Match, Show, Switch } from "solid-js";
import { A } from "@solidjs/router";

import { useAuthContext } from "../../_contexts/AuthContext";
import { logout } from "../../auth/_routes";

import Icon from "../icon/Icon";

interface Props {
    showTitle: boolean;
}

const UserInfo: Component<Props> = props => {
    const [authContext] = useAuthContext();

    return (
        <>
            <div class="dropdown dropdown-bottom dropdown-center md:dropdown-right md:dropdown-start dropdown-hover cursor-pointer">
                <div class="flex primary-nav-link" role="button">
                    <Show
                        when={authContext.user?.picture}
                        fallback={<Icon classes="icon-[ic--round-person]" />}
                    >
                        <img
                            src={authContext.user?.picture}
                            class="w-[29px] h-[29px] block rounded-full cursor-pointer"
                        />
                    </Show>
                    <span
                        classList={{
                            "ml-2": true,
                            "text-lg": true,
                            "font-bold": true,
                            "align-middle": true,
                            hidden: true,
                            "md:inline": props.showTitle
                        }}
                    >
                        {authContext.user?.given_name}
                    </span>
                </div>

                <ul class="menu dropdown-content bg-base-300 rounded z-1 w-52 p-2 shadow">
                    <li>
                        <A
                            class="cursor-pointer hover:bg-primary hover:text-primary-content"
                            href={logout.absolutePath}
                        >
                            <Icon classes="icon-[mdi--logout]" />
                            <span>Logout</span>
                        </A>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default UserInfo;
