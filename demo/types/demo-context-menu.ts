/** Optional props for demo list screens — forwarded to `PspList` right-click menu. */
export type DemoContextMenuProps = {
  onPatCountBySpecialty?: () => void;
  onPluginListSelect?: (id: string) => void;
};
