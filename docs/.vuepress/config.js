import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'
import { hopeTheme } from 'vuepress-theme-hope'
import { llmsPlugin } from '@vuepress/plugin-llms'
import sidebar from './sidebar.js'

export default defineUserConfig({
    lang: 'en-US',

    title: 'Vuepress Template',
    description: '',
    theme: hopeTheme({
        hostname: "https://vuepress-template.netlify.app",
        logo: '/logo.png',
        markdown: {
            tabs: true,
            mermaid: true,
        },
        plugins: {
            icon: {
                assets: "fontawesome",
            },
            slimsearch: {
                locales: {
                    '/': {
                        placeholder: 'Search'
                    }
                },
                hotKeys: [{ key: 's', ctrl: true }]
            },

        },

        sidebar,
        footer: "Copyright © 2025 Beyens J.",
        displayFooter: true,
        navbar: [
            { text: "Home", link: "/" },
            {
                text: "Guide",
                icon: "book",
                children: [
                    { text: "Introduction", link: "/guide/" },
                    { text: "Features", link: "/guide/features.md" },
                    { text: "Configuration", link: "/guide/config.md" },
                ],
            },
        ],


    }),

    plugins: [
        llmsPlugin({
            domain: "https://vuepress-template.netlify.app",
        }),
    ],

    bundler: viteBundler(),
})
