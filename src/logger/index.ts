export default (level: 'DEBUG' | 'ERROR', ...messages: any[]) => {
  console.log(level, ...messages)
}