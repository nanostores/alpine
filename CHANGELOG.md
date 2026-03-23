# Change Log
This project adheres to [Semantic Versioning](http://semver.org/).

## 0.1.1
- Fixed broken magic properties in `withStores`.

## 0.1.0

- Initial release.
- `x-nano` directive: bind a Nano Store to a named scope property with automatic cleanup.
- `x-nano-model` directive: two-way binding between an `atom` store and form inputs.
- `$nano` magic: inline access to any store value in Alpine expressions.
- `withStores()`: type-safe `Alpine.data` factory helper.
