<template>
    <section>
        <!--<img :src="movie.picture" alt="">
        <hr>-->
        <div class="movieFrame">
            <iframe
                :src=movie.url
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
        </div>
    </section>
</template>

<script>
    export default {
        props: {
            host: {
                type: String,
                default: 'youtube'
            },
            id: {
                type: String,
                default: '09oErCBjVns'
            },
            start: {
                type: [Number, String],
                default: 0
            },
            end: {
                type: [Number, String],
                default: 99999999
            },
        },
        computed: {
            movie: function () {
                let start = this.start;
                let end = this.end;
                let url = '';
                let picture = '';
                if (this.host === 'youtube') {
                    // https://developers.google.com/youtube/player_parameters
                    url = `https://www.youtube.com/embed/${this.id}?start=${start}&end=${end}&hl=en&rel=0`;
                    picture = `https://img.youtube.com/vi/${this.id}/0.jpg`;
                }
                return {
                    url: url,
                    picture: picture
                };
            },
        }
    }
</script>

<style scoped>
    .movieFrame {
        margin: 1rem 0;
        position: relative;
        overflow: hidden;
        width: 100%;
        padding-top: 56.25%; /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */
    }

    .movieFrame iframe {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
    }
</style>
