package maven_project02;

import java.time.Duration;
import java.util.List;
import java.util.NoSuchElementException;

import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.PageLoadStrategy;
import org.openqa.selenium.Proxy;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Action;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.locators.RelativeLocator;
import org.openqa.selenium.support.ui.ExpectedConditions;
//import org.openqa.selenium.support.ui.FluentWait;
import org.openqa.selenium.support.ui.Wait;
import org.openqa.selenium.support.ui.WebDriverWait;

public class mavenproject2 {
		
		public static void main(String[] args) throws InterruptedException {
       			
			WebDriverManager.chromedriver().setup();
			WebDriver driver = new ChromeDriver();
			/*
			driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
			driver.manage().timeouts().scriptTimeout(Duration.ofMinutes(2));
			driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(10));
			driver.manage().window().maximize();
               
		
			driver.get("https://google.com");
			WebElement searchBox=driver.findElement(By.name("q"));
			//: Finds all elements on the page that match the criteria
			searchBox.sendKeys("ABCD",Keys.ENTER);
			Thread.sleep(25000);
		
			driver.navigate().to("https://trytestingthis.netlify.app/");
			List<WebElement> options = driver.findElements(By.name("Optionwithcheck[]"));
			//finds all matching checkboxes or radio buttons on a web page and stores them in a list.
			for(WebElement element : options)
			{
				System.out.println(element.getText());
			}
			
			driver.findElement(By.cssSelector("#fname")).sendKeys("pranav");
			Thread.sleep(15000);
			
			driver.navigate().to("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
			
			WebElement loginButton = driver.findElement(By.xpath("//button[@type=\"submit\"]"));
			driver.findElement(RelativeLocator.with(By.tagName("input")).above(loginButton)).sendKeys("ABCD");
			
			//implicitwait
			driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(15));
			
			driver.get("https://google.com");
			
			driver.findElement(By.name("q")).sendKeys("apple"+ Keys.ENTER);
			
			//ExplicitWait
			
			WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
			WebElement myLink = wait.until(ExpectedConditions.elementToBeClickable(By.partialLinkText("Apple (India)")));
			myLink.click();
			Thread.sleep(5000);
			
			//fluent wait
			
			Wait<WebDriver> fluentWait = new FluentWait<WebDriver>(driver)
					.withTimeout(Duration.ofSeconds(10))
					.pollingEvery(Duration.ofSeconds(1))
					.ignoring(org.openqa.selenium.NoSuchElementException.class);
			
			fluentWait.until(ExpectedConditions.elementToBeSelected(By.xpath("//html/body/main/section[2]/div[3]/a")));
		
			
			//js alert
			driver.get("https://the-internet.herokuapp.com/javascript_alerts");
			driver.findElement(By.xpath("//button[@onclick='jsAlert()']")).click();
			Alert alert1 = driver.switchTo().alert();
			System.out.println(alert1.getText());
			Thread.sleep(2000);
			alert1.accept();
	
				
			
			//js confirm
		
			driver.findElement(By.xpath("//button[@onclick='jsConfirm()']")).click();
			Alert alert2 = driver.switchTo().alert();
			System.out.println(alert2.getText());
			Thread.sleep(2000);
			alert2.dismiss();
			if(driver.getPageSource().contains("You clicked: Cancel"))
			System.out.println("you click cancel");
			
			
			driver.findElement(By.xpath("//button[@onclick='jsPrompt()']")).click();
			Alert alert3 = driver.switchTo().alert();
			System.out.println(alert3.getText());
			alert3.sendKeys("hii");
			Thread.sleep(2000);
			alert3.accept();
			
				
			
		*/
			
/*	
			
			
			
			Proxy proxy = new Proxy();
			proxy.setAutodetect(false);
			proxy.setSslProxy("localhost:8080");
			
			ChromeOptions options = new ChromeOptions();
			options.setCapability("proxy", proxy);
			WebDriverManager.chromedriver().setup();
			WebDriver driver = new ChromeDriver(options);
			
			driver.get("https://google.com/");
			
*/                    
/*		//Normal Load
			ChromeOptions option = new ChromeOptions();
			option.setPageLoadStrategy(PageLoadStrategy.NORMAL);
			WebDriverManager.chromedriver().setup();
			WebDriver driver = new ChromeDriver();
			
			driver.get("https://www.makemytrip.com/");
*/
/*			
			
			//WAIT UNTIL THE INITIAL HTML DOCUMENT AND DISCARD LOADING STYLESHEET, IMAGE AND SUBFRAME
			ChromeOptions option1 = new ChromeOptions();
			option1.setPageLoadStrategy(PageLoadStrategy.EAGER);
			WebDriverManager.chromedriver().setup();
			WebDriver driver = new ChromeDriver();
			
			driver.get("https://www.makemytrip.com/");
			driver.quit();
*/
 /*          //none waits until initial page to be loaded		
			ChromeOptions option1 = new ChromeOptions();
			option1.setPageLoadStrategy(PageLoadStrategy.NONE);
			WebDriverManager.chromedriver().setup();
			WebDriver driver = new ChromeDriver();
			
			driver.get("https://www.makemytrip.com/");
			driver.quit();
 */     
			       
/*			driver.get("https://google.com");
			driver.findElement(By.name("q")).sendKeys("selenium" + Keys.ENTER);
	    	Actions actionProvider = new Actions(driver);
			Action Keydown = actionProvider.keyDown(Keys.CONTROL).sendKeys("a").build();
			Keydown.perform();
	
*/	
/*			
			//KeyUP
			driver.get("https://google.com");
			Actions actions = new Actions(driver);
			WebElement searchBox = driver.findElement(By.name("q"));
			actions.keyDown(Keys.SHIFT).sendKeys(searchBox, "selenium")
			.keyUp(Keys.SHIFT).sendKeys("selenium").perform();
*/			
			
	}

}
