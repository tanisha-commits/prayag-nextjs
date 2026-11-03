"use client";

import { usePathname, useRouter } from "next/navigation";
import { paramsFromQuery, type PublicQuery } from "@/lib/catalog/url";

export interface FormOption {
  label: string;
  slug: string;
  children: FormOption[];
}

export interface FormGroup {
  key: string;
  label: string;
  options: FormOption[];
  selected: string[];
  /** Flat `.bef-checkboxes` instead of the nested list. */
  flat?: boolean;
}

/**
 * Source exposed filter form (better_exposed_filters checkboxes, auto-submitted on change). Each
 * change reloads the listing for the new selection from the first page, like the source's auto-submit.
 */
export function FilterForm({ id, groups, sort }: { id?: string; groups: FormGroup[]; sort?: PublicQuery["sort"] }) {
  const router = useRouter();
  const pathname = usePathname();
  const selection = Object.fromEntries(groups.map((g) => [g.key, g.selected]));

  const toggle = (key: string, slug: string, checked: boolean) => {
    const current = selection[key] ?? [];
    const filters = { ...selection, [key]: checked ? [...current, slug] : current.filter((s) => s !== slug) };
    const qs = paramsFromQuery({ filters, sort }).toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const item = (g: FormGroup, o: FormOption) => {
    const id = `edit-${g.key.replace(/\W+/g, "-")}-${o.slug.replace(/\W+/g, "-")}`;
    return (
      <div key={o.slug} className="form-type-boolean js-form-item form-item js-form-type-checkbox">
        <input
          type="checkbox"
          id={id}
          name={`${g.key}[${o.slug}]`}
          value={o.slug}
          checked={g.selected.includes(o.slug)}
          onChange={(e) => toggle(g.key, o.slug, e.target.checked)}
          className="form-checkbox form-boolean form-boolean--type-checkbox"
        />
        <label htmlFor={id} className="form-item__label option">
          {o.label}
        </label>
      </div>
    );
  };

  const list = (g: FormGroup, options: FormOption[]) => (
    <ul>
      {options.map((o) => (
        <li key={o.slug}>
          {item(g, o)}
          {o.children.length > 0 && list(g, o.children)}
        </li>
      ))}
    </ul>
  );

  return (
    <form id={id} className="views-exposed-form bef-exposed-form form--inline" onSubmit={(e) => e.preventDefault()}>
      {groups.map((g) => (
        <fieldset key={g.key} className="fieldgroup form-composite fieldset fieldset--group js-form-item form-item js-form-wrapper form-wrapper">
          <legend className="fieldset__legend fieldset__legend--composite fieldset__legend--visible">
            <span className="fieldset__label fieldset__label--group">{g.label}</span>
          </legend>
          <div className="fieldset__wrapper fieldset__wrapper--group">
            <div className="form-boolean-group form-checkboxes">
              {g.flat ? (
                <div className="form-checkboxes bef-checkboxes">{g.options.map((o) => item(g, o))}</div>
              ) : (
                <div className="form-checkboxes bef-checkboxes bef-nested">{list(g, g.options)}</div>
              )}
            </div>
          </div>
        </fieldset>
      ))}
      {/* Source auto-submit form keeps its (script-hidden) Apply button. The source's whitespace before it
          matters where the form is not a grid (Kitchen Sinks): the inline-block sits on its own line box. */}{" "}
      <div className="form-actions js-form-wrapper form-wrapper">
        <input className="js-hide button js-form-submit form-submit" type="submit" value="Apply" />
      </div>
    </form>
  );
}
