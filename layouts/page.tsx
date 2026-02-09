import { h } from "npm:preact@10.28";
import { render } from "npm:preact-render-to-string@6.6";

type PageProps = { title: string, updated: string, content: string, [key: string]: string };
export function Page(props: PageProps): string {
    const Component = (
        <article class="page">
            <h1 id="page-title">{ props.title }</h1>
            <div class="text-right">Last updated: { props.updated }</div>
            <div class="markdown-body" dangerouslySetInnerHTML={{ __html: props.content }}></div>
        </article>
    );

    return render(Component);
}