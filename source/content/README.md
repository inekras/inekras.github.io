# Editing the homepage

The expandable sections of the homepage are ordinary Markdown files in this folder. You can edit the prose, links, headings, and formulas without touching the page layout.

Use a single pair of dollar signs for inline mathematics:

~~~text
The group $GL_n(\mathbb{C})$ acts on $V^{\otimes n}$.
~~~

Use double dollar signs for a displayed formula:

~~~text
$$
\operatorname{Hom}_{\mathcal C}(X,Y) \cong \operatorname{Hom}_{\mathcal C}(\mathbf 1, X^* \otimes Y).
$$
~~~

The formula syntax is LaTeX rendered by KaTeX. Standard commands, Greek letters, matrices, aligned expressions, and most mathematical notation are supported.
