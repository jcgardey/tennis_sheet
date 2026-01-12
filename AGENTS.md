# shadcn instructions

Use Shadcn components when it's possible. Use the following commmand to install the latest version: 

```bash
npx shadcn@latest add button
```

# creating components
Use arrow functions and named exports when creating a new component as follows:

```typescript
export const MyComponent: React.FC<MyComponentProps> = () => {}
```



# data fetching

Use axios for data fetching. Perform requests inside functions defined in /services. 

Depending on the target resource create new functions on existing files or add a new one if it is needed.

Service files have to define also request params and response types.

In react components use tanstack query when using the services for handling error and loading states.