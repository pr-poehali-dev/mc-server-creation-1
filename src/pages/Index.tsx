import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [serverAddress, setServerAddress] = useState('lampfish.aternos.host:38608');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [serverStatus, setServerStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const checkServerStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://api.mcsrvstat.us/3/${serverAddress}`);
      const data = await response.json();
      setServerStatus(data);
      setIsOnline(data.online || false);
      
      if (!data.online) {
        toast({
          title: "Сервер оффлайн",
          description: "Не удалось подключиться к серверу",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось проверить статус сервера",
        variant: "destructive"
      });
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  }, [serverAddress]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(serverAddress);
    setCopied(true);
    toast({
      title: "Скопировано!",
      description: "Адрес сервера скопирован в буфер обмена",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const onlinePlayers = serverStatus?.players?.online || 0;
  const maxPlayers = serverStatus?.players?.max || 0;
  const version = serverStatus?.version || '1.21.8';
  const motd = serverStatus?.motd?.clean?.[0] || 'Minecraft Server';

  const playersList = serverStatus?.players?.list || [];
  const hasPlayers = playersList.length > 0;

  const stats = [
    { label: 'Игроки онлайн', value: isOnline ? `${onlinePlayers}/${maxPlayers}` : 'Оффлайн', icon: 'Users' },
    { label: 'Статус', value: isOnline ? 'Онлайн' : 'Оффлайн', icon: 'Activity' },
    { label: 'Протокол', value: serverStatus?.protocol?.name || 'N/A', icon: 'Wifi' },
    { label: 'Версия', value: version, icon: 'Package' },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-neon" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-neon" style={{ animationDelay: '1s' }} />

      <div className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-green-500/20 border-2 border-green-500/50 rounded-lg backdrop-blur-sm">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-green-400 font-bold uppercase tracking-wider text-sm">сервер всегда активен сайт немного врёт</span>
      </div>

      <a
        href="https://t.me/+sDoo4fcptANmNGYy"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-secondary/20 hover:bg-secondary/40 border-2 border-secondary/30 neon-border-purple rounded-lg transition-all hover:scale-105 group"
      >
        <Icon name="Send" className="text-secondary group-hover:rotate-12 transition-transform" size={24} />
        <span className="hidden md:inline text-secondary font-bold uppercase tracking-wider">Telegram</span>
      </a>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center mb-16 animate-float">
          <h1 className="text-6xl md:text-8xl font-black mb-4 neon-glow text-primary uppercase tracking-wider">
            MINECRAFT
          </h1>
          <p className="text-2xl md:text-3xl text-foreground/80 font-light tracking-wide">
            Присоединяйся к легенде
          </p>
        </div>

        <Card className="max-w-2xl mx-auto mb-12 bg-card/50 backdrop-blur-sm border-2 border-primary/30 neon-border">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">Адрес сервера</p>
              
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${
                  isOnline 
                    ? 'bg-green-500/20 border-green-500/50' 
                    : 'bg-red-500/20 border-red-500/50'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  }`} />
                  <span className={`font-bold uppercase tracking-wider ${
                    isOnline ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isOnline ? 'Онлайн' : 'Офлайн'}
                  </span>
                </div>
              </div>

              {isEditing ? (
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Input
                    value={serverAddress}
                    onChange={(e) => setServerAddress(e.target.value)}
                    className="text-2xl font-bold text-primary text-center bg-background/50 border-2 border-primary/50 neon-border max-w-md"
                    placeholder="mc.yourserver.net"
                  />
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      checkServerStatus();
                    }}
                    className="neon-border bg-primary/20 hover:bg-primary/40 text-primary font-bold uppercase tracking-wider transition-all"
                    size="lg"
                  >
                    <Icon name="Check" className="mr-2" size={20} />
                    Готово
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-4 flex-wrap mb-4">
                  <code className="text-3xl md:text-4xl font-bold text-primary neon-glow select-all">
                    {serverAddress}
                  </code>
                </div>
              )}

              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Button
                  onClick={copyToClipboard}
                  className="neon-border-purple bg-secondary/20 hover:bg-secondary/40 text-secondary-foreground font-bold uppercase tracking-wider transition-all"
                  size="lg"
                >
                  <Icon name={copied ? "Check" : "Copy"} className="mr-2" size={20} />
                  {copied ? 'Скопировано!' : 'Копировать'}
                </Button>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="neon-border bg-primary/20 hover:bg-primary/40 text-primary font-bold uppercase tracking-wider transition-all"
                    size="lg"
                    variant="outline"
                  >
                    <Icon name="Edit" className="mr-2" size={20} />
                    Изменить
                  </Button>
                )}
                <Button
                  onClick={checkServerStatus}
                  disabled={isLoading}
                  className="neon-border-pink bg-accent/20 hover:bg-accent/40 text-accent font-bold uppercase tracking-wider transition-all"
                  size="lg"
                  variant="outline"
                >
                  <Icon name={isLoading ? "Loader2" : "RefreshCw"} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} size={20} />
                  Обновить
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-secondary neon-glow uppercase tracking-wider">
            Статистика сервера
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card 
                key={index} 
                className="bg-card/50 backdrop-blur-sm border-2 border-secondary/30 neon-border-purple hover:scale-105 transition-transform duration-300"
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-secondary/20 rounded-lg neon-border-purple">
                      <Icon name={stat.icon as any} className="text-secondary" size={32} />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {isOnline && hasPlayers && (
            <Card className="bg-card/50 backdrop-blur-sm border-2 border-accent/30 neon-border-pink mb-12">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-center mb-6 text-accent neon-glow uppercase tracking-wider">
                  <Icon name="Users" className="inline mr-2" size={28} />
                  Игроки онлайн
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {playersList.map((player: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-accent/20 hover:border-accent/50 transition-colors"
                    >
                      <div className="w-10 h-10 flex items-center justify-center bg-accent/20 rounded-lg neon-border-pink flex-shrink-0">
                        <Icon name="User" className="text-accent" size={20} />
                      </div>
                      <p className="font-bold text-foreground truncate">{player.name || player}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {isOnline && serverStatus?.motd?.html && (
            <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/30 neon-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-center mb-4 text-primary neon-glow uppercase tracking-wider">
                  <Icon name="Info" className="inline mr-2" size={28} />
                  О сервере
                </h3>
                <div className="text-center text-foreground/80">
                  {serverStatus.motd.clean.map((line: string, i: number) => (
                    <p key={i} className="text-lg mb-1">{line}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <div className={`w-3 h-3 rounded-full animate-pulse-neon ${isOnline ? 'bg-primary' : 'bg-destructive'}`} />
            <p className="text-sm uppercase tracking-wider">
              Сервер {isOnline ? 'онлайн' : 'оффлайн'}
            </p>
          </div>
          {motd && isOnline && (
            <p className="text-xs text-muted-foreground mt-2 max-w-md mx-auto">{motd}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;