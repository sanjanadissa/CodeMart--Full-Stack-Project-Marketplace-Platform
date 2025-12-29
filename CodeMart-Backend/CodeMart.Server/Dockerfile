FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["CodeMart.Server.csproj", "./"]
RUN dotnet restore "CodeMart.Server.csproj"

COPY . .
WORKDIR /src
RUN dotnet build "CodeMart.Server.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CodeMart.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

RUN groupadd -r appuser && useradd -r -g appuser appuser

COPY --from=publish /app/publish .

RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 8080
EXPOSE 8081

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "CodeMart.Server.dll"]
