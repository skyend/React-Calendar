import { Provider } from 'mobx-react'
import { getSnapshot } from 'mobx-state-tree'
import App, { Container } from 'next/app'
import React from 'react'
import { initializeStore, IStore } from '../stores'
import '../assets/style/global.less';
import ModalRender from "../components/Modal/ModalRender";
import ModalStore from "../stores/modalStore";

interface IOwnProps {
    isServer: boolean
    initialState: IStore
}

class MyApp extends App {
    public static async getInitialProps({ Component, router, ctx }) {
        //
        // Use getInitialProps as a step in the lifecycle when
        // we can initialize our store
        //
        const isServer = typeof window === 'undefined'
        const store = await initializeStore(isServer)
        //
        // Check whether the page being rendered by the App has a
        // static getInitialProps method and if so call it
        //
        let pageProps = {}
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx, store)
        }
        return {
            initialState: getSnapshot(store),
            isServer,
            pageProps,
        }
    }

    private store: IStore
    private modalStore: ModalStore;

    constructor(props) {
        super(props)
        this.store = initializeStore(props.isServer, props.initialState) as IStore
        this.modalStore = new ModalStore();
    }

    public render() {
        const { Component, pageProps } = this.props
        return (
            <Container>
                <Provider store={this.store} modal={this.modalStore}>
                    <ModalRender/>
                    <Component {...pageProps} />
                </Provider>
            </Container>
        )
    }
}

export default MyApp
