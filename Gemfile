source "https://rubygems.org"

gem "jekyll", "~> 4.3"

# No :jekyll_plugins group on purpose.
#
# jekyll-feed and jekyll-sitemap used to be listed here, and neither ever ran: GitHub Pages
# builds this site with actions/jekyll-build-pages, which runs Jekyll in safe mode against its
# own gem bundle and loads only plugins named under `plugins:` in _config.yml. The Gemfile group
# auto-loads under a local `bundle exec jekyll serve` and nowhere else, so /sitemap.xml and
# /feed.xml existed on a developer's laptop and 404'd in production — including the
# <link rel="alternate"> the layout emits on every page.
#
# Both files are now plain Liquid templates in the repo root (sitemap.xml, feed.xml), which
# build identically in both places. Keep it that way; re-adding the plugins would have them
# race the checked-in templates for the same output paths.

# Windows/JRuby platform gems for older Jekyll compatibility
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.1.1", platforms: [:mingw, :x64_mingw, :mswin]
