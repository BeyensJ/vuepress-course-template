import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'
import { hopeTheme } from 'vuepress-theme-hope'
import { llmsPlugin } from '@vuepress/plugin-llms'
import sidebar from './sidebar.js'

const base_url = "https://itf-course-template.netlify.app/";

export default defineUserConfig({
    lang: 'en-US',

    title: 'Vuepress Template',
    description: '',
    theme: hopeTheme({
        hostname: base_url,
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
            domain: base_url,
        }),
    ],

    bundler: viteBundler(),
})
