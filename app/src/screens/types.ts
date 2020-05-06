interface NavigationComponentProps {
    componentId: string;
}
interface NavigationComponentOptions {
    options?: (passProps?: Record<string, any>) => object;
}

type NavigationComponent<P> =
    React.FC<P & NavigationComponentProps> & NavigationComponentOptions;

// ====================================================================
// ====================================================================
interface HomeComponentProps { }
type HomeComponentType = NavigationComponent<HomeComponentProps>;

interface LandComponentProps { }
type LandComponentType = NavigationComponent<LandComponentProps>;

interface EmptyComponentProps { }
type EmptyComponentType = NavigationComponent<EmptyComponentProps>;

interface LoginComponentProps { }
type LoginComponentType = NavigationComponent<LoginComponentProps>;

interface InitialisingComponentProps { }
type InitialisingComponentType = NavigationComponent<LoginComponentProps>;

interface Home2ComponentProps { }
type Home2ComponentType = NavigationComponent<Home2ComponentProps>;

interface Land2ComponentProps { }
type Land2ComponentType = NavigationComponent<LandComponentProps>;