import { ParentComponent, createContext } from "solid-js";
import { createStore } from "solid-js/store";

export const buildServiceContext = <T,>() => {
    type ServiceState = {
        readonly service?: T;
    };

    const defaultServiceState = {
        service: undefined
    };

    type ServiceContextValue = [
        state: ServiceState,
        actions: {
            setService: (service?: T) => void;
        }
    ];

    const ServiceContext = createContext<ServiceContextValue>([
        defaultServiceState,
        {
            setService: () => undefined
        }
    ]);

    const ServiceProvider: ParentComponent = (props) => {
        const [state, setState] = createStore(defaultServiceState);

        const setService = (service?: T) => {
            setState({service});
        }

        return (
            <ServiceContext.Provider value={[state, {
                setService
            }]}>
                {props.children}
            </ServiceContext.Provider>
        );
    };

    return {ServiceContext, ServiceProvider};
}
