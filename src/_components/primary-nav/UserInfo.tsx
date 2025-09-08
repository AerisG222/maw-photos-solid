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

    const nameClass = () => ({
        "ml-2": true,
        "text-lg": true,
        "font-bold": true,
        "align-middle": true,
        hidden: true,
        "md:inline": props.showTitle
    });

    const logoutWidget = () => {
        return (
            <>
                <ul
                    tabindex="0"
                    class="menu dropdown-content bg-base-300 rounded z-[1] mt-2 w-52 p-2 shadow"
                >
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
            </>
        );
    };

    // todo: check the dropdown menu on full and mobile - the breakpoints weren't working nicely, so just left
    // at the md size for now - this is what i was going to use for mobile: dropdown-bottom dropdown-center
    return (
        <>
            <div class="cursor-pointer dropdown dropdown-right dropdown-center dropdown-hover">
                <div class="flex primary-nav-link" tabindex="0" role="button">
                    <Show
                        when={authContext.user?.picture}
                        fallback={<Icon classes="icon-[ic--round-person]" />}
                    >
                        <img
                            src={authContext.user?.picture}
                            class="w-[29px] h-[29px] block rounded-full cursor-pointer"
                        />
                    </Show>
                    <span classList={nameClass()}>{authContext.user?.given_name}</span>
                </div>
                {logoutWidget()}
            </div>
        </>
    );
};

export default UserInfo;
